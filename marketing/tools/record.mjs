#!/usr/bin/env node
// Record a real gap-finder session for the README demo. Nothing here is needed to use the plugin.
// It runs Claude Code headlessly with only this plugin loaded, in a throwaway folder that holds
// the sample notes. A second Claude call plays the student, from the knowledge profile below.
// The transcript goes to marketing/tools/session.json, which assets.mjs renders.
//
//   node marketing/tools/record.mjs
//
// Needs Claude Code, logged in. Each run uses a few dollars of Claude usage and writes a new
// transcript, so run it only when the gap-finder skill changes. MODEL=<name> picks the tutor's
// model; it defaults to your Claude Code default.
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { skillHash } from "./skill-hash.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const PROMPT = "Quiz me on photosynthesis using examples/photosynthesis-notes.md. I studied it yesterday.";
const SKILL = "alinear-study:gap-finder";
const MAX_TURNS = 20;

// The demo data. The student studied the sample notes yesterday and has a realistic mix of gaps,
// so the session shows several gap types. Nothing here tells the tutor what to find.
const STUDENT = `You are a first-year biology student in a study session with a tutor. You read the notes
on photosynthesis yesterday and have a short-answer midterm on Friday. Your notes are closed.
You last looked at them last night. This is the first time you've tested yourself on it.

What you know and believe:
- Photosynthesis has two stages. The light reactions happen in the thylakoids and make ATP and
  NADPH. The Calvin cycle happens in the stroma and fixes CO2 into sugar (G3P, then glucose).
  You're sure of this.
- You believe the oxygen plants release comes from the CO2 they take in: the carbon is kept for
  sugar and the oxygen is let go. You're sure of this. It's wrong, but you don't know that.
- You know the Calvin cycle uses ATP and NADPH from the light reactions. You half-remember it's
  called "light-independent", so you think it probably keeps going in the dark, maybe more slowly.
  You're unsure.
- You don't know that the Calvin cycle sends anything back to the light reactions. If asked, you
  think the light reactions just need light and water.
- You remember rubisco is the enzyme that fixes CO2. You don't remember photorespiration at all,
  but if the tutor hints at rubisco and oxygen, you vaguely recall "rubisco can grab O2 by mistake".
- You can list the limiting factors: light intensity, CO2, temperature. You're sure. You can't
  work out what happens on a hot, dry day; you'd guess heat speeds up the enzymes.
- Anything else, answer from general intro-biology knowledge, with honest uncertainty.

How you write:
- Casual, brief: one to three short sentences. Lowercase is fine. No lists, no markdown.
- Answer only from what you know above. Never look anything up or quote the notes.
- When the tutor asks for a confidence tag, end with (sure), (unsure), or (guess).
- If the tutor asks setup questions, answer them briefly from the facts above.
- Never act as the tutor, never ask the tutor to explain mid-quiz, never thank them at length.`;

const run = (args, opts = {}) => execFileSync("claude", args, { encoding: "utf-8", maxBuffer: 256 << 20, ...opts });

const home = fs.mkdtempSync(path.join(os.tmpdir(), "alinear-demo-"));
fs.mkdirSync(path.join(home, "examples"));
fs.copyFileSync(path.join(root, "examples", "photosynthesis-notes.md"), path.join(home, "examples", "photosynthesis-notes.md"));
const sessionId = randomUUID();
// Only this plugin: project settings from the empty folder, no user skills, no MCP servers.
const isolated = ["--plugin-dir", root, "--setting-sources", "project", "--strict-mcp-config",
  "--tools", "Read,Skill", "--allowedTools", "Read,Skill", "--add-dir", root];

// Paths in the transcript read as the plugin's own paths and the student's folder, not this machine's.
const mask = (text) => text.replaceAll(fs.realpathSync(home) + "/", "").replaceAll(home + "/", "")
  .replaceAll(root + "/", "").replaceAll(os.homedir(), "~");

let model = process.env.MODEL;
let cost = 0;

/** One tutor turn. Returns the text blocks and tool calls in the order Claude made them. */
function tutor(message, first) {
  const args = ["-p", message, ...isolated, "--output-format", "stream-json", "--verbose",
    ...(first ? ["--session-id", sessionId] : ["--resume", sessionId]), ...(model ? ["--model", model] : [])];
  const blocks = [];
  for (const line of run(args, { cwd: home }).split("\n").filter(Boolean)) {
    const event = JSON.parse(line);
    if (event.type === "system" && event.subtype === "init") model ??= event.model;
    if (event.type === "assistant") {
      for (const block of event.message.content) {
        if (block.type === "text" && block.text.trim()) blocks.push({ text: mask(block.text.trim()) });
        if (block.type === "tool_use") {
          const target = block.input.skill ?? block.input.file_path ?? "";
          blocks.push({ tool: block.name, target: mask(target) });
        }
      }
    }
    if (event.type === "result") {
      if (event.is_error) throw new Error(`Claude Code returned an error: ${event.result}`);
      cost += event.total_cost_usd ?? 0;
    }
  }
  return blocks;
}

/** The student's reply to everything said so far. */
function student(turns) {
  const transcript = turns.map((t) => (t.role === "user" ? "STUDENT: " : "TUTOR: ")
    + t.blocks.filter((b) => b.text).map((b) => b.text).join("\n\n")).join("\n\n");
  const out = JSON.parse(run(["-p", `${transcript}\n\nWrite the student's next message. Reply with the message only.`,
    "--system-prompt", STUDENT, "--tools", "", "--setting-sources", "project", "--strict-mcp-config",
    "--no-session-persistence", "--model", "sonnet", "--output-format", "json"], { cwd: home }));
  cost += out.total_cost_usd ?? 0;
  return out.result.trim();
}

const turns = [{ role: "user", blocks: [{ text: PROMPT }] }];
console.log(`> ${PROMPT}`);
for (let i = 0; i < MAX_TURNS; i++) {
  const blocks = tutor(turns.at(-1).blocks[0].text, i === 0);
  turns.push({ role: "assistant", blocks });
  for (const b of blocks) console.log(b.text ? `\n${b.text}` : `  [${b.tool} ${b.target}]`);
  if (i === 0 && !blocks.some((b) => b.tool === "Skill" && b.target === SKILL)) {
    throw new Error(`The README's first prompt didn't load ${SKILL}. Check the skill's description.`);
  }
  if (blocks.some((b) => b.text && /^## Gaps/m.test(b.text))) break;
  const reply = student(turns);
  console.log(`\n> ${reply}`);
  turns.push({ role: "user", blocks: [{ text: reply }] });
}
if (!turns.at(-1).blocks.some((b) => b.text && /^## Gaps/m.test(b.text))) {
  throw new Error(`No gap report after ${MAX_TURNS} turns. Read the transcript above to see where the session stalled.`);
}

const version = JSON.parse(fs.readFileSync(path.join(root, ".claude-plugin", "plugin.json"), "utf-8")).version;
const session = { recorded: new Date().toISOString().slice(0, 10), model, plugin: version, skillHash: skillHash(root), turns };
fs.writeFileSync(path.join(here, "session.json"), JSON.stringify(session, null, 2) + "\n");
fs.rmSync(home, { recursive: true, force: true });
console.log(`\nWrote marketing/tools/session.json: ${turns.length} messages, ${model}, $${cost.toFixed(2)}`);
