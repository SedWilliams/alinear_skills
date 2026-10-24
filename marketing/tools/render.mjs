// Draw a recorded session as a terminal chat window, in ALinear's colors and fonts.
// Messages are the session's real text. Claude's Markdown is rendered the way a terminal
// shows it: bold, headings, lists, and tables, in one monospace font.
import { pathToFileURL } from "node:url";

// ALinear's theme tokens (app/globals.css in the ALinear app).
export const THEME = {
  bg: "#16161d", surface: "#1f1f27", raised: "#2a2a37", border: "#363646", strong: "#54546d",
  fg: "#dcd7ba", muted: "#938aa9", subtle: "#c8c093", accent: "#98bb6c", blue: "#7e9cd8",
  highlight: "#e6c384", red: "#e46876",
};

export const WINDOW = { width: 1120, height: 760 };

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const inline = (s) => escape(s)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
  .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, "$1<i>$2</i>");

/** The Markdown Claude writes in a chat: headings, paragraphs, lists, tables, and rules. */
export function markdown(text) {
  const out = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const heading = /^(#{1,4})\s+(.*)/.exec(line);
    if (heading) { out.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); i++; continue; }
    if (/^\s*(---|\*\*\*)\s*$/.test(line)) { out.push("<hr>"); i++; continue; }
    if (/^\s*\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const body = rows.filter((r) => !/^\s*\|[\s|:-]+\|\s*$/.test(r)).map(cells);
      const [head, ...rest] = body;
      out.push(`<table><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr>`
        + rest.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("") + "</table>");
      continue;
    }
    const item = /^(\s*)([-*]|\d+\.)\s+(.*)/;
    if (item.test(line)) {
      const items = [];
      while (i < lines.length && item.test(lines[i])) {
        const [, indent, marker, body] = item.exec(lines[i++]);
        items.push(`<li class="${indent.length ? "sub" : ""}"><span class="mark">${/\d/.test(marker) ? marker : "-"}</span><span>${inline(body)}</span></li>`);
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\s*\||\s*([-*]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++]);
    out.push(`<p>${para.map(inline).join("<br>")}</p>`);
  }
  return out.join("");
}

/** One message: the student's (typed so far) or Claude's text blocks and tool calls. */
export function message(turn, { typed, cursor } = {}) {
  if (turn.role === "user") {
    const full = turn.blocks[0].text;
    const text = typed === undefined ? full : full.slice(0, typed);
    return `<div class="msg user"><span class="prompt">&gt;</span><div class="plain">${escape(text)}${cursor ? '<span class="cursor"></span>' : ""}</div></div>`;
  }
  return turn.blocks.map((b) => b.tool
    ? `<div class="msg tool"><span class="dot">⏺</span><div><b>${b.tool}</b><span class="target">(${escape(b.target)})</span></div></div>`
    : `<div class="msg claude${b.report ? " report" : ""}"><span class="dot">⏺</span><div class="md">${markdown(b.text)}</div></div>`).join("");
}

export const divider = (text) => `<div class="msg divider"><span>${escape(text)}</span></div>`;

export const fontCss = (fontDir) => {
  const url = (name) => pathToFileURL(`${fontDir}/${name}`).href;
  return `
@font-face { font-family: Geist; src: url("${url("Geist.ttf")}"); font-weight: 100 900; }
@font-face { font-family: GeistMono; src: url("${url("GeistMono.ttf")}"); font-weight: 100 900; }
@font-face { font-family: Serif; src: url("${url("InstrumentSerif-Regular.ttf")}"); }
@font-face { font-family: Serif; src: url("${url("InstrumentSerif-Italic.ttf")}"); font-style: italic; }`;
};

const t = THEME;
export const chatCss = `
html, body { margin: 0; background: transparent; }
.win { box-sizing: border-box; display: flex; flex-direction: column; background: ${t.bg};
  border: 1px solid ${t.border}; overflow: hidden; font-family: GeistMono; font-variant-ligatures: none; }
.bar { flex: none; height: 40px; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 0 16px; background: ${t.surface}; border-bottom: 1px solid ${t.border}; position: relative;
  font: 500 13px GeistMono; color: ${t.muted}; }
.dots { display: flex; gap: 8px; }
.dots i { width: 12px; height: 12px; border-radius: 50%; background: ${t.strong}; }
.title { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: ${t.subtle}; }
.stamp { position: relative; }
.screen { position: relative; flex: 1; min-height: 0; overflow: hidden; padding: 0 26px; }
.log { display: flex; flex-direction: column; gap: 14px; padding: 20px 0 22px; }
.msg { display: flex; gap: 12px; font-size: 14.5px; line-height: 1.55; color: ${t.fg}; }
.msg .dot { flex: none; width: 14px; color: ${t.blue}; font-size: 12px; line-height: 22.5px; }
.msg.tool { color: ${t.muted}; margin-bottom: -8px; }
.msg.tool .dot { color: ${t.accent}; }
.msg.tool b { color: ${t.fg}; font-weight: 600; }
.msg.user { background: ${t.raised}; border-radius: 6px; padding: 8px 14px; margin: 4px 0; color: ${t.fg}; }
.msg.user .prompt { flex: none; width: 14px; color: ${t.accent}; font-weight: 700; }
.plain { white-space: pre-wrap; }
.cursor { display: inline-block; width: 0.6em; height: 1.15em; margin-left: 1px; vertical-align: -0.2em; background: ${t.fg}; }
.md { min-width: 0; flex: 1; }
.md > :first-child { margin-top: 0; }
.md > :last-child { margin-bottom: 0; }
.md p { margin: 0 0 10px; }
.md b { color: #f2ecd2; font-weight: 700; }
.md i { color: ${t.subtle}; }
.md code { color: ${t.highlight}; }
.md h1, .md h2, .md h3, .md h4 { margin: 4px 0 10px; font-size: 14.5px; font-weight: 700; color: ${t.highlight}; }
.md h2::before { content: "## "; color: ${t.strong}; }
.md h3::before { content: "### "; color: ${t.strong}; }
.md ul { list-style: none; margin: 0 0 10px; padding: 0; }
.md li { display: flex; gap: 10px; }
.md li.sub { padding-left: 24px; }
.md li .mark { flex: none; color: ${t.muted}; }
.md hr { border: 0; border-top: 1px solid ${t.border}; margin: 12px 0; }
.md table { border-collapse: collapse; margin: 2px 0 12px; font-size: 13px; line-height: 1.45; }
.md th, .md td { border: 1px solid ${t.border}; padding: 4px 10px; text-align: left; vertical-align: top; }
.md th { color: ${t.subtle}; font-weight: 600; background: ${t.surface}; }
.divider { justify-content: center; color: ${t.muted}; font-size: 13px; margin: 6px 0; }
.divider span { padding: 3px 14px; border: 1px dashed ${t.strong}; border-radius: 999px; }
`;

/**
 * A chat window with `body` inside. The log sits at the bottom of the screen, like a terminal,
 * except when the last message is taller than the screen: then its top stays in view, unless
 * `end` asks for the bottom of it.
 */
export const chatWindow = (body, { title, stamp, width = WINDOW.width, height = WINDOW.height, end = false }) => `
<div class="win" style="width:${width}px;height:${height}px">
<div class="bar"><span class="dots"><i></i><i></i><i></i></span><span class="title">${escape(title)}</span><span class="stamp">${escape(stamp)}</span></div>
<div class="screen"><div class="log">${body}</div></div></div>
<script>
document.fonts.ready.then(() => {
  const screen = document.querySelector(".screen"), log = document.querySelector(".log");
  const last = log.lastElementChild;
  screen.scrollTop = !${end} && last.offsetHeight + 40 > screen.clientHeight ? last.offsetTop - 20 : screen.scrollHeight;
});
</script>`;

export const page = (head, body) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${head}</style></head><body>${body}</body></html>`;
