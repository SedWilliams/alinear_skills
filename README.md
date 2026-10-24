# ALinear Study Skills

**Find what you don't know before your exam does. Claude asks the questions, and you do the thinking.**

[![License: MIT](https://img.shields.io/badge/license-MIT-98bb6c.svg)](LICENSE)
[![Dependencies](https://img.shields.io/badge/dependencies-none-7e9cd8.svg)](skills/test-mind-map/scripts/map_checks.py)
[![Skills](https://img.shields.io/badge/skills-4-ffe271.svg)](#the-skills)

Asking an AI to explain a topic feels like studying. The AI does most of the work, though, and the gaps in your own understanding stay hidden until the exam finds them. These four skills turn that around. Claude asks one question at a time, you answer from memory, and a right answer you weren't sure of counts as a gap. Each session ends with a ranked list of what to fix and when to test yourself again.

The plugin is four Markdown skills and one Python script that uses only the standard library. It needs no account or API key, and it sends nothing anywhere.

## Install

### Claude Code

```sh
claude plugin marketplace add SedWilliams/alinear_skills
claude plugin install alinear-study@alinear
```

Start a new session and the skills load. Claude picks the right one from what you ask, or you can call one by name, such as `/alinear-study:gap-finder`.

### claude.ai and Cowork

Download this repository as a zip. In claude.ai or the desktop app, go to **Customize → Plugins → Add → Upload plugin** and choose the zip.

## The skills

| Skill | Ask something like | What happens |
|---|---|---|
| `gap-finder` | "Quiz me on the Krebs cycle. My exam is Friday." | One question at a time, big ideas first, with a confidence tag on every answer. Ends with a gap report and a date for the next session. |
| `test-mind-map` | "Here's my mind map of the French Revolution. Grill me on it." | Checks the map's structure, then asks about its weak spots one at a time. It never redraws your map. |
| `mind-map-dump` | "I drew this from memory. Here are my lecture slides. What did I miss?" | Marks what you recalled against your material as right, wrong, missing, or unsure, with the big ideas weighted most. |
| `retrieval-plan` | "How should I revise organic chemistry this week? I have three hours." | Picks techniques that fit the material and how long ago you learned it, then turns each gap into a fix and a retest date. |

Each one works on its own. They share one set of gap types (Locked, Missing, Wrong, Shaky, Unlinked, Can't apply, Can't create, Blind spot), so reports from different sessions line up.

## Try it

The `examples/` folder has material to try the skills on:

- `photosynthesis-notes.md`: one page of source notes.
- `photosynthesis-map.json`: a student's mid-study map of the same topic, with some holes in it.
- `alinear-workspace.json` and `alinear-prompt.txt`: ALinear's built-in photosynthesis example, as a workspace export and as the text of its Build AI prompt.

Three prompts, one per kind of session:

1. `Quiz me on photosynthesis using examples/photosynthesis-notes.md. I studied it yesterday.`
2. `Test my mind map in examples/photosynthesis-map.json against examples/photosynthesis-notes.md. It's a mid-study draft.`
3. `I have a biology midterm in two weeks on photosynthesis and cellular respiration. Plan my review sessions.`

## Why it won't just tell you the answer

Pulling something out of memory makes it stick better than reading it again (Roediger & Karpicke, 2006). Trying first, even when you get it wrong, helps the right answer stick once you see it (Kornell, Hays & Bjork, 2009). A session where Claude explains and you nod along skips both. So the skills hold back the answer until you've committed to one, and they count a right answer you weren't sure of as a gap, because unsure answers are the ones that tend not to come back (Butler, Karpicke & Roediger, 2008).

They also escalate. Three sure, correct answers in a row means the questions are too easy to show what you know, so the next one gets harder.

Each skill's `references/` folder lists the studies its rules come from.

## Works with ALinear

I also built [ALinear](https://alinear-gold.vercel.app), a study workspace for college students. You map a topic as a graph, say why each link exists, and write your own answer before it builds a prompt for your AI tool.

`test-mind-map` reads ALinear's output directly. Paste the text from ALinear's **Build AI prompt**, or give it a workspace `.json`, and it checks the structure from that instead of from a photo of your handwriting. You don't need ALinear for any of the skills.

## Privacy

The plugin has no server and makes no network requests. The skills are instructions Claude follows in your conversation. `map_checks.py` runs on your machine and reads only the file you pass it. What you share in the conversation follows the terms of the Claude app you use. If you ask Claude to read or write your notes in a connected app such as Notion, it uses that connector under that app's terms, and it writes only after you say yes. [PRIVACY.md](PRIVACY.md) has the details.

## Limits

- With no material from you, Claude checks your answers against its own knowledge, which can be wrong and may not match your course. Give it your notes or slides for anything graded.
- It won't do graded work. Give it a live assignment and it writes parallel questions on the same ideas instead.
- Photos of handwritten maps can be misread. The skills tell you how they read each unclear label and what they couldn't read, so you can correct them.
- A session takes effort and feels slower than asking for an explanation.

## Credits

The research behind each rule is cited in the skills' `references/` folders.

I learned much of how I study from iCanStudy, Dr Justin Sung's learning program ([icanstudy.com](https://icanstudy.com)). Treating every review session as a hunt for gaps is a habit I picked up there. Its frameworks, such as GRINDE maps and the Bear Hunter System, belong to iCanStudy, and this plugin doesn't teach or reproduce the course. If you want the full method, take the course.

## Development

```sh
claude plugin validate --strict .                                                   # manifests and skill front matter
python3 skills/test-mind-map/scripts/map_checks.py examples/photosynthesis-map.json  # structure report for the sample map
python3 skills/test-mind-map/scripts/map_checks.py examples/alinear-workspace.json   # same checks on an ALinear export
claude --plugin-dir .                                                               # one session with the skills, no install
```

```text
.claude-plugin/     plugin.json and marketplace.json
skills/             one folder per skill: SKILL.md, references/, scripts/
examples/           sample notes, a sample map, and ALinear's example export
assets/icon.png     the listing icon
```

Issues and pull requests are welcome.

## License

[MIT](LICENSE) © Shedrick Williams
