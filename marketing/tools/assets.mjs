#!/usr/bin/env node
// Rebuild every README image from a real session. Nothing here is needed to use the plugin.
// It exists so the README images can't drift from what the skills do: record.mjs runs a real
// gap-finder session in Claude Code and saves it to session.json, and this script draws that
// transcript as the demo GIF and the social card. It makes no Claude calls.
//
//   node marketing/tools/assets.mjs
//
// The README images go to docs/assets. A 1080p demo video stays in marketing/tools/.cache/build.
// Needs Node 22, Google Chrome (CHROME=/path/to/chrome to override), and Python 3. The first
// run downloads fonts, Pillow, and ffmpeg into marketing/tools/.cache.
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { launch } from "./chrome.mjs";
import { WINDOW, chatCss, chatWindow, divider, fontCss, message, page } from "./render.mjs";
import { skillHash } from "./skill-hash.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const cache = path.join(here, ".cache");
const build = path.join(cache, "build");
const run = (command, ...args) => execFileSync(command, args, { cwd: root, stdio: "inherit" });

const session = JSON.parse(fs.readFileSync(path.join(here, "session.json"), "utf-8"));
if (session.skillHash !== skillHash(root)) {
  console.warn("gap-finder has changed since session.json was recorded. Run node marketing/tools/record.mjs to record a new session.");
}
const { turns } = session;

// Fonts are ALinear's, OFL-licensed, and fetched once into a local cache.
const FONTS = {
  "Geist.ttf": "https://github.com/google/fonts/raw/main/ofl/geist/Geist%5Bwght%5D.ttf",
  "GeistMono.ttf": "https://github.com/google/fonts/raw/main/ofl/geistmono/GeistMono%5Bwght%5D.ttf",
  "InstrumentSerif-Regular.ttf": "https://github.com/google/fonts/raw/main/ofl/instrumentserif/InstrumentSerif-Regular.ttf",
  "InstrumentSerif-Italic.ttf": "https://github.com/google/fonts/raw/main/ofl/instrumentserif/InstrumentSerif-Italic.ttf",
};
const fontDir = path.join(cache, "fonts");
for (const [name, url] of Object.entries(FONTS)) {
  const file = path.join(fontDir, name);
  if (fs.existsSync(file)) continue;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not download ${url}: ${res.status}`);
  fs.mkdirSync(fontDir, { recursive: true });
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}
const css = fontCss(fontDir) + chatCss;

// Storyboard: the opening request and setup, then each exchange up to the first time Claude marks
// an answer the student was sure of as wrong. Then a marker for the answers skipped, and the report.
const text = (turn) => turn.blocks.filter((b) => b.text).map((b) => b.text).join("\n\n");
const caught = turns.findIndex((t, i) => i > 2 && t.role === "assistant" && /\*\*wrong\*\*/i.test(text(t))
  && /\(sure\)/i.test(text(turns[i - 1])));
if (caught < 0) {
  throw new Error("No reply marks a sure answer **wrong**, which is the demo's payoff. Record a new session or change the storyboard in assets.mjs.");
}
const last = turns.at(-1).blocks.find((b) => b.text && /^## Gaps/m.test(b.text));
if (!last) throw new Error("The session's last reply has no ## Gaps report. Record a new session.");
const report = last.text.slice(last.text.search(/^## Gaps/m)).split(/^---$/m)[0].trim();
const skipped = turns.slice(caught + 1, -1).filter((t) => t.role === "user").length;

const frames = [];
const log = [];
const show = (ms, extra = "", end = false) => frames.push({ body: log.join("") + extra, ms, end });
const hold = (s) => Math.min(3600, Math.max(2200, 800 + s.length * 5));
function type(turn) {
  const full = turn.blocks[0].text;
  const steps = Math.min(22, Math.max(6, Math.ceil(full.length / 7)));
  for (let s = 0; s <= steps; s++) show(s ? 45 : 250, message(turn, { typed: Math.round((full.length * s) / steps), cursor: true }));
  log.push(message(turn));
  show(400);
}
function reply(turn) {
  for (const block of turn.blocks) {
    log.push(message({ role: "assistant", blocks: [block] }));
    show(block.tool ? 300 : hold(block.text));
  }
}
for (const turn of turns.slice(0, caught + 1)) (turn.role === "user" ? type : reply)(turn);
frames.at(-1).ms = 4800;
log.push(divider(`${skipped} more answers`));
show(1200);
// The report is taller than the window: its table first, then its end, with the next session date.
log.push(message({ role: "assistant", blocks: [{ text: report, report: true }] }));
show(4500);
show(3500, "", true);

const title = "claude · alinear-study";
const stamp = `recorded ${session.recorded} · ${session.model}`;
// The page must not overflow sideways. The report opens at its heading, then scrolls to its end.
const check = (end) => `(() => {
  const screen = document.querySelector(".screen").getBoundingClientRect(), log = document.querySelector(".log");
  if (log.scrollWidth > log.clientWidth + 1) return "a message is wider than the window";
  const report = document.querySelector(".report");
  if (report && !${end} && report.querySelector("h2").getBoundingClientRect().top < screen.top) return "the report heading is cut off";
  if (report && ${end} && report.getBoundingClientRect().bottom > screen.bottom) return "the end of the report is cut off";
  return "";
})()`;

const browser = await launch();
fs.rmSync(path.join(build, "demo"), { recursive: true, force: true });
fs.mkdirSync(build, { recursive: true });
const tmp = fs.mkdtempSync(path.join(build, ".html-"));
let n = 0;
async function shoot(html, out, size, end = false) {
  const file = path.join(tmp, `${n++}.html`);
  fs.writeFileSync(file, html);
  await browser.shot(file, out, { check: check(end), ...size });
}

// Demo frames: the window alone for the GIF, and the window on a 1080p stage for the video.
const stage = `body { width: 1920px; height: 1080px; display: flex; align-items: center; justify-content: center;
  background: radial-gradient(1200px 700px at 80% 10%, rgba(126,156,216,.10), transparent 60%), #111116; }
.stage { width: ${WINDOW.width * 1.3}px; height: ${WINDOW.height * 1.3}px; }
.stage .win { transform: scale(1.3); transform-origin: 0 0; border-radius: 12px; box-shadow: 0 30px 80px rgba(0,0,0,.5); }`;
const manifest = [];
for (const [i, frame] of frames.entries()) {
  const name = `${String(i).padStart(4, "0")}.png`;
  const win = chatWindow(frame.body, { title, stamp, end: frame.end });
  await shoot(page(css, win), path.join(build, "demo", "gif", name), { ...WINDOW, scale: 2 }, frame.end);
  await shoot(page(css + stage, `<div class="stage">${win}</div>`), path.join(build, "demo", "video", name),
    { width: 1920, height: 1080, scale: 1 }, frame.end);
  manifest.push({ file: name, ms: frame.ms });
}
fs.writeFileSync(path.join(build, "demo", "manifest.json"), JSON.stringify(manifest, null, 2));

// Social card: the moment Claude catches the answer the student was sure of. The student's
// sentence with the wrong claim, then Claude's reply up to the sentence that marks it wrong.
const answer = text(turns[caught - 1]);
const claim = answer.split(/(?<=\.)\s+/).find((s) => /\bo2\b|oxygen/i.test(s));
if (!claim) throw new Error("The caught answer no longer mentions O2. Update the social card excerpt in assets.mjs.");
const paragraphs = text(turns[caught]).split(/\n\n+/);
const upTo = paragraphs.findIndex((p) => /\*\*wrong\*\*/i.test(p));
const verdict = [...paragraphs.slice(0, upTo), paragraphs[upTo].split(/(?<=\.)\s+/).find((s) => /\*\*wrong\*\*/i.test(s))].join("\n\n");
log.length = 0;
log.push(message({ role: "user", blocks: [{ text: `…${claim.replace(/^also\s+/i, "")} (sure)` }] }));
log.push(message({ role: "assistant", blocks: [{ text: verdict }] }));
const cardCss = `.card-win .msg { font-size: 16.5px; line-height: 1.55; } .card-win .screen { padding: 0 22px; }
.card-win .stamp { display: none; } .card-win .log { gap: 18px; padding: 24px 0; }`;
const icon = pathToFileURL(path.join(root, "assets", "icon.png")).href;
const card = fs.readFileSync(path.join(here, "social-card.html"), "utf-8")
  .replace("<!-- icon -->", `<img src="${icon}" alt="">`)
  .replace("<!-- session -->", chatWindow(log.join(""), { title, stamp: "", width: 500, height: 344 }));
await shoot(page(css + cardCss, card), path.join(build, "social-card.png"), { width: 1280, height: 640, scale: 2 });

await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
const seconds = frames.reduce((sum, f) => sum + f.ms, 0) / 1000;
console.log(`Rendered the social card and ${frames.length} demo frames (${seconds.toFixed(1)} s) into ${build}`);

// The GIF and MP4 encoder runs in its own virtual environment. pip skips packages it already has.
const venv = path.join(cache, "venv");
const python = path.join(venv, "bin", "python");
if (!fs.existsSync(python)) run("python3", "-m", "venv", venv);
run(python, "-m", "pip", "install", "--quiet", "--disable-pip-version-check", "pillow", "imageio-ffmpeg");
run(python, path.join(here, "encode.py"), build, path.join(build, "demo.gif"), path.join(build, "demo.mp4"), String(WINDOW.width));

const docs = path.join(root, "docs", "assets");
fs.mkdirSync(docs, { recursive: true });
for (const file of ["social-card.png", "demo.gif"]) {
  fs.copyFileSync(path.join(build, file), path.join(docs, file));
  console.log(`docs/assets/${file}: ${(fs.statSync(path.join(docs, file)).size / 1e6).toFixed(2)} MB`);
}
