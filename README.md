# dsh-theme-picker

A theme picker for the [DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/dsh)
web app — choose your colors once, and they stay.

## What This Does

It adds a **Theme Picker** tab to Settings. Pick a theme and it applies right
away; it is still your theme after a reload or a restart. Six choices:

| Theme | Look |
| --- | --- |
| Default | the built-in look |
| Dracula | dark |
| Catppuccin Latte | light |
| Catppuccin Frappé | soft dark |
| Catppuccin Macchiato | dark |
| Catppuccin Mocha | deep dark |

Works with **DSH 0.1.7-rc.2**, web profile.

## Getting Started

Install it from a terminal — either command below, same plugin:

```sh
# main, as it moves — the form that always resolves
dsh plugin --profile web add github:prv-ctech/dsh-theme-picker

# one exact release, pinned until you say otherwise
dsh plugin --profile web add github:prv-ctech/dsh-theme-picker#v0.1.2
```

Then restart `dsh web` and open **Settings → Theme Picker**.

## Removing It

```sh
dsh plugin --profile web remove dsh-theme-picker
```

Restart `dsh web`. Everything goes back to the default theme — the plugin
leaves nothing painted behind.

## Credits

Dracula colors adapted from
[ossFrankFrank/dsh-dracula-theme](https://github.com/ossFrankFrank/dsh-dracula-theme)
(MIT) and Catppuccin colors from
[zhijun-dai/Catppuccin-dsh-theme](https://github.com/zhijun-dai/Catppuccin-dsh-theme)
(MIT). Palettes by [Dracula](https://draculatheme.com/) and
[Catppuccin](https://github.com/catppuccin/catppuccin). Thanks to all of them.

## License

MIT — see [LICENSE](./LICENSE).
