# Privacy

Last updated: 2026-10-18

ALinear Study Skills is a Claude plugin made of instructions (skills) and one local script. It has no server, no account, and no analytics of its own, and it makes no network requests.

## What the plugin does with your data

- The skills are text that tells Claude how to run a study session. Claude follows them inside your conversation.
- `skills/test-mind-map/scripts/map_checks.py` runs wherever Claude runs code for you. It reads only the map file it's given, prints a report, and writes nothing.
- The plugin's author receives nothing from your sessions: no conversation content, files, or answers.

## What other services see

- Your conversation, including anything you paste or upload, is handled by the Claude app you use (Claude Code, claude.ai, or Cowork) under Anthropic's terms and privacy policy.
- If you ask Claude to read or write your notes in a connected app such as Notion, Claude uses that connector under that app's terms. The skills write to your notes only after you say yes.
- If you install the plugin from Anthropic's plugin directory, Anthropic's developer portal shows the publisher usage counts for the plugin: installs, versions in use, how often each skill runs, and error rates.

## Contact

Open an issue at https://github.com/SedWilliams/alinear_skills/issues.
