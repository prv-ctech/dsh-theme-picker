# Theme-Picker Plugin for DSH 0.1.7-rc.2

Approved via harness plan mode (exit_plan_mode) on 2026-09-27. This file is the
execution record of that approved plan.

## Goal

A local DSH bundle `dsh-theme-picker` that adds a **Theme Picker** tab to the
Settings GUI with Dracula and all four Catppuccin flavors (Latte, Frappé,
Macchiato, Mocha) plus Default. Themes apply instantly (no restart), the
selection survives reloads/restarts/container updates/plugin updates, and
uninstalling the plugin reverts the UI to the default DeepSeek theme with no
breakage.

## Non-goals (v1)

dsh-TUI themes, glassmorphism/glow/surface-tint CSS polish, custom theme
import/export, update-check route, accent/contrast/font axes, npm publishing
(local `install_bundle` only).

## Researched architecture facts (0.1.7-rc.2)

- `ctx.theme` client service: `register(ThemeDefinition) → disposer`,
  `setTheme(id)`, `getTheme()`, `overrideTokens(source, pairs)`, event
  `theme/change`. `ThemeDefinition = { id, colorScheme: 'light'|'dark',
  tokens: Record<string,string> }`. Third-party theme ids are in-process only;
  only `light|dark|system` persist into the `ui-theme` settings namespace.
- `register()`'s disposer resets an active third-party preference to the
  built-in default — the runtime's own uninstall-revert.
- `ThemeRuntime.adopt()` re-adopts the durable built-in preference on every
  `ui-theme` scope republish (font-size change, settings-doc re-sync,
  reconnect) and clobbers third-party preferences. Defense (dsh-catppuccin
  pattern): wrap `ctx.theme.setTheme` to record explicit built-in picks; on
  `theme/change`, yield to explicit picks, re-assert the saved theme otherwise
  (from `setTimeout(0)` — a re-entrant `setTheme` inside the dispatch is
  missed by ui-layout's presenter).
- `settings.section` is a public list slot (registration `id` required,
  `order`, `label`); shipped orders: account=-10, general=0, models=10,
  plugins=15, agent-presets=20. Panel component receives `close` prop.
- Host `webServer` service: `register({kind:'exact', path, handler})`,
  disposers. `webserver/index-inject` event can inject pre-plugin boot CSS.
- Client bundle: `window.__ModuleLoader__.load({ id, factory })`; the id MUST
  equal the package name. `react`, `react/jsx-runtime`,
  `@deepseek-ai/dsh-client-store` are seed modules.
- Persistence (both reference theme plugins): localStorage + `$DSH_HOME` JSON
  state file over a webServer route (the settings document is deliberately
  avoided: writes round-trip a describe refresh through `ui-theme`'s scope,
  triggering `adopt()` clobbers, and no-op on non-loopback connections).
- Live theme-color token set: 187 tokens (`--dsw-alias-*`, `--dsw-static-*`,
  `--shiki-*`, `--scroll-*`). Reference token tables (ossFrankFrank Dracula,
  zhijun-dai Catppuccin) each miss the same 25 — to be filled from palettes.
- Reference plugins: zhijun-dai/Catppuccin-dsh-theme (MIT),
  ossFrankFrank/dsh-dracula-theme (MIT), dennisrongo/dsh-theme
  (settings.section tab pattern), CoolTea001/dsh-cool-theme (0.1.5, concept).

## Design decisions

1. `ctx.theme.register()` + `setTheme()` mechanism (first-class selectable
   themes; runtime-managed colorScheme; dispose-revert built in).
2. Namespaced theme ids (`theme-picker/dracula`, `theme-picker/catppuccin-*`)
   to avoid register collisions with other theme plugins; each registration
   individually try/caught.
3. Clobber defense: setTheme wrapper (record explicit built-in picks; restore
   on dispose). `theme/change`: explicit built-in pick → yield and persist
   selection `default` (the pick becomes the durable baseline); built-in
   without a live pick (adopt echo) → re-assert saved theme via
   `setTimeout(0)`; another plugin's third-party id → drop our stored
   selection; always remember the last built-in pref for Default restore.
4. Persistence: localStorage (instant) + `GET/PUT /theme-picker/state` over
   `$DSH_HOME/theme-picker-state.json` (atomic temp+rename, mode 0600, 4KB
   body cap, strict `{version:1, selection}` validation). Hydrate from file
   when localStorage is empty; debounced 300ms PUT.
5. Boot flash mitigation: host half subscribes `webserver/index-inject` and
   paints the selected theme's `bg-base` + `color-scheme` before first paint.
6. Settings tab: `settings.section`, `id: theme-picker`, `order: 5`, localized
   label. Card grid (Default + 5 themes) with palette swatches from token
   tables; radiogroup a11y; instant apply; copy via `ctx.locale` (zh+en).
   Styling: one `<style>` with `.dstp-` classes, only `--dsw-*` tokens;
   removed on dispose.
7. Token tables: Dracula from ossFrankFrank (MIT), Catppuccin ×4 from
   zhijun-dai (MIT); fill the 25 missing tokens from each palette. Tables
   inline in `lib/client.js`.

## Verification

- `node --check` both lib files; `test/themes.mjs` (SKINS shape, ids,
  colorScheme, tokens ⊆ live 187-token set, core token coverage) and
  `test/state.mjs` (host validation/state roundtrip) green.
- `plugin_manager install_bundle` → `application: applied`, no warnings.
- Live: Client `Theme.listTokens` shows registered themes' tokens; state
  route roundtrip via node-fetch.
- User visual pass (no browser control available): tab visible, instant
  apply, reload/restart persistence, Appearance-row interplay, uninstall
  revert.

## Edge cases

- Adopt clobber mid-session → re-assert (one publish-cycle blip; same as
  shipped reference plugins).
- Other theme plugins → namespaced ids + cross-plugin drop-our-selection
  convention.
- Headless profile (no webServer) → host half inert; client is web-only.
- Corrupt/oversized state or body → rejected/ignored; localStorage stays
  authoritative.
- Uninstall/HMR → disposers run; state file/localStorage remain but have no
  effect.

## Assumptions

- `$DSH_HOME` persists across container/image updates (mounted volume).
- Browser localStorage is per-origin; the file layer covers fresh browsers
  and Desktop port churn.
- "Container updates" = the DSH server container, not the user's browser.
