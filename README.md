# dsh-theme-picker

Adds a **Theme Picker** tab to the Settings of your
[DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/dsh) — pick a
theme once; it applies instantly and survives reloads and restarts.

Compatible with **DSH 0.1.7-rc.2** (web profile).

## Themes

| Theme | Look |
| --- | --- |
| Default | the built-in look |
| Dracula | dark |
| Catppuccin Latte | light |
| Catppuccin Frappé | soft dark |
| Catppuccin Macchiato | dark |
| Catppuccin Mocha | deep dark |

## Install from GitHub

```sh
# main, as it moves — the form that always resolves
dsh plugin --profile web add github:prv-ctech/dsh-theme-picker

# one exact release, pinned until you say otherwise
dsh plugin --profile web add github:prv-ctech/dsh-theme-picker#v0.1.1

# the newest release, as it moves (a rolling tag)
dsh plugin --profile web add github:prv-ctech/dsh-theme-picker#latest
```

Then **restart `dsh web`** and open Settings → Theme Picker. Uninstalling
reverts everything to the default theme; nothing is left painted behind.

## Credits

Dracula mapping adapted from
[ossFrankFrank/dsh-dracula-theme](https://github.com/ossFrankFrank/dsh-dracula-theme)
(MIT). Catppuccin mappings adapted from
[zhijun-dai/Catppuccin-dsh-theme](https://github.com/zhijun-dai/Catppuccin-dsh-theme)
(MIT).

## License

MIT — see [LICENSE](./LICENSE).
