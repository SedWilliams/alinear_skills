# Contributing

Bug reports and new example material are welcome. The most useful report is a session where a skill gave away an answer or missed an obvious gap. Open an issue or a pull request.

## Getting set up

```sh
git clone https://github.com/SedWilliams/alinear_skills.git
cd alinear_skills
claude --plugin-dir .
```

`--plugin-dir` loads the skills from your clone for one session, so you can try a change without reinstalling the plugin.

## Before you open a pull request

```sh
claude plugin validate --strict .                                                      # must pass with nothing to report
python3 skills/test-mind-map/scripts/map_checks.py examples/photosynthesis-map.json     # must print a report, not an error
python3 skills/test-mind-map/scripts/map_checks.py examples/alinear-workspace.json      # same, for an ALinear export
```

If your change alters gap-finder, record a new session and regenerate the README images, then commit them with your change:

```sh
node marketing/tools/record.mjs
node marketing/tools/assets.mjs
```

`record.mjs` needs Claude Code, logged in, and each run uses a few dollars of Claude usage. It fails if the first prompt doesn't load gap-finder or the session ends without a gap report. If you only change how the images look, run `assets.mjs` alone.

`assets.mjs` needs Node 22, Google Chrome, and Python 3 on macOS or Linux. Set `CHROME=/path/to/chrome` if Chrome lives somewhere unusual. The first run downloads fonts, Pillow, and ffmpeg into `marketing/tools/.cache`. The student's knowledge profile lives in `record.mjs`. `assets.mjs` decides which exchanges the GIF shows and how long each one stays on screen.

## Directory layout

| | |
|---|---|
| `skills/` | the plugin: one folder per skill |
| `examples/` | sample material for trying the skills |
| `marketing/tools/` | README image capture and the recorded session, not part of the plugin |
| `docs/assets/` | the images the README shows, written by `assets.mjs` |
| `specs/` | design specs for the skills, not part of the plugin |

## License

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
