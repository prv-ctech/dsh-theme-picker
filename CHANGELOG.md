# Changelog

Consumer-visible changes to `dsh-theme-picker`, newest first. Entries are grouped
by impact rather than by commit: the commit log is for the repo, this file is for
you. Versions follow [semver](https://semver.org/), and a release is published
only when the git tag, the manifest version, an entry here and a green CI run on
`main` all agree — [release.yml](./.github/workflows/release.yml) fails the run
otherwise.

## [Unreleased]

Nothing consumer-visible. Repo-only work: a version tag now publishes only when
its commit is already on `main` with a green CI run
([release-guard.mjs](./scripts/release-guard.mjs)), and `main` carries branch
protection — a required `check` status, no force pushes, no deletion.

## [0.1.3] - 2026-09-27

### Changed

- Nothing about the plugin changes. `lib/` differs from `0.1.2` only where the
  formatter reflowed `lib/index.js`; the release exists so the pinned install tag
  and the manifest version agree again.

### Repository

- CI on every push to `main` and every pull request: `fmt:check`, `lint`, both
  test suites, and `pnpm audit`. The git hooks run the same gate, plus a
  Conventional Commits subject check, before a commit becomes public.
- The client-half suite measures every skin's text against WCAG contrast floors —
  4.5:1 for body text, 3:1 for meta text — on each surface the plugin paints, so
  a palette edit that makes a label unreadable fails the build instead of
  shipping. The helper is pinned to WCAG's published reference ratios.
- The researched palette tokens are committed under `research/`, so the suite
  runs off this machine, and the release workflow lifts each version's changelog
  section into its release notes.

## [0.1.2] - 2026-09-27

### Fixed

- `dsh plugin --profile web add github:prv-ctech/dsh-theme-picker` installs a
  working plugin. The package used to sit below the repository root, so dsh
  resolved a placeholder manifest with no `dsh.bundle`, added no profile layer,
  and the plugin silently did nothing. The package is the repository root now,
  and a test guards that shape.

### Changed

- The README documents both install forms: the moving `main` branch, or one
  pinned release tag.
- Releases publish version tags only — the rolling `latest` tag is neither
  created nor moved. No `0.1.1` release exists: the install fix landed on top of
  `0.1.0` and shipped as `0.1.2`.

## [0.1.0] - 2026-09-27

### Added

- A **Theme Picker** tab in Settings, with Default plus five palettes: Dracula
  and the four Catppuccin flavors (Latte, Frappé, Macchiato, Mocha).
- Instant switching that survives a reload and a restart. The selection lives in
  a small JSON file under `$DSH_HOME`, written atomically with mode `0600`, with
  browser `localStorage` as the instant layer.
- A head style injected before any script runs, so a reload paints the chosen
  background instead of flashing the default palette while the client loads.

[Unreleased]: https://github.com/prv-ctech/dsh-theme-picker/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/prv-ctech/dsh-theme-picker/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/prv-ctech/dsh-theme-picker/compare/v0.1.0...v0.1.2
[0.1.0]: https://github.com/prv-ctech/dsh-theme-picker/releases/tag/v0.1.0
