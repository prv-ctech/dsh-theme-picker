# Changelog

Consumer-visible changes to `dsh-theme-picker`, newest first. Entries are grouped
by impact rather than by commit: the commit log is for the repo, this file is for
you. Versions follow [semver](https://semver.org/), and a release is published
only when the git tag, the manifest version and an entry here all agree —
[release.yml](./.github/workflows/release.yml) fails the run otherwise.

## [Unreleased]

Nothing consumer-visible yet. Repo-only work: oxlint and oxfmt gates with CI on
every push to `main`, a committed pre-commit hook that runs them before a commit
becomes public, a `pnpm audit` gate, and this changelog.

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

[Unreleased]: https://github.com/prv-ctech/dsh-theme-picker/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/prv-ctech/dsh-theme-picker/compare/v0.1.0...v0.1.2
[0.1.0]: https://github.com/prv-ctech/dsh-theme-picker/releases/tag/v0.1.0
