# dsh-theme-picker

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 0.1.7-rc.2
plugin that adds a **Theme Picker** tab to Settings with **Dracula** and the
four **Catppuccin** flavors (Latte, Frappé, Macchiato, Mocha), plus Default.

## Features

- **Settings → Theme Picker tab** — a card grid (Default + 5 themes), each
  card previewing the theme's palette.
- **Instant switching** — selecting a theme applies it immediately; no
  restart, no reload.
- **Durable selection** — the choice is stored in browser `localStorage`
  and in a small JSON file under `$DSH_HOME`
  (`theme-picker-state.json`), so it survives page reloads, server restarts,
  fresh browsers, DSH Desktop's random per-launch port, and container/image
  updates when `$DSH_HOME` is a mounted volume.
- **Zero footprint on uninstall** — themes register into the built-in theme
  runtime, whose own disposal path resets the UI to the built-in appearance;
  removing the bundle leaves nothing painted behind.
- **Plays well with the built-in Appearance row** — an explicit
  Light/Dark/System pick made in Settings → General always wins and becomes
  your new baseline; the picker never fights it.

## Install

From a checkout of this repository (DSH 0.1.7-rc.2 with the web profile):

```sh
dsh plugin --profile web add /path/to/dsh-theme-picker
```

or through the Harness plugin manager (`install_bundle` with this package
directory). Then open the web UI → Settings → Theme Picker.

## How it works

- The browser half registers each theme into the built-in `ctx.theme` runtime
  (`ThemeDefinition` with `--dsw-*` alias/static token overrides, including
  the `--shiki-*` syntax palette) and switches with `setTheme(id)`.
- The runtime persists only built-in preferences, so the plugin owns the
  selection's persistence (localStorage + a `GET/PUT /theme-picker/state`
  route over the Host's webServer, atomically written under `$DSH_HOME`).
- The `ui-theme` settings scope re-adopts the durable built-in preference on
  every settings-document refresh, which would silently revert a third-party
  theme; the plugin tracks explicit built-in picks and re-asserts the saved
  theme otherwise (the same defense the dsh-catppuccin plugin ships).
- The Host half also injects a pre-plugin boot style painting the selected
  theme's base background, so a reload does not flash the default palette
  before the plugin loads.

## Theme sources & attribution

- [Dracula](https://draculatheme.com) palette; token mapping adapted from
  [ossFrankFrank/dsh-dracula-theme](https://github.com/ossFrankFrank/dsh-dracula-theme)
  (MIT).
- [Catppuccin](https://github.com/catppuccin/catppuccin) palette (Latte,
  Frappé, Macchiato, Mocha); token mappings adapted from
  [zhijun-dai/Catppuccin-dsh-theme](https://github.com/zhijun-dai/Catppuccin-dsh-theme)
  (MIT).
- Client-plugin architecture references:
  [dennisrongo/dsh-theme](https://github.com/dennisrongo/dsh-plugins/tree/main/plugins/dsh-theme)
  and [CoolTea001/dsh-cool-theme](https://github.com/CoolTea001/dsh-cool-theme).

## License

MIT — see [LICENSE](./LICENSE).
