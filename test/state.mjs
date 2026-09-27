/**
 * dsh-theme-picker — host half tests (pure logic, no HTTP).
 *
 * Covers the install shape (the package must be the repo root), the PUT-body
 * trust boundary (validation), the durable state file roundtrip, and the
 * boot-style derivation. Run: node test/state.mjs
 */
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deepStrictEqual, ok, strictEqual } from 'node:assert'
import { after, before, describe, test as check } from 'node:test'

const host = await import('../lib/index.js')

// --- install shape: the package must be the repo root ---------------------
// `dsh plugin add github:owner/repo` resolves the repository root, so a
// package nested in a subdirectory installs as a pnpm placeholder manifest
// with no `dsh.bundle`: dsh does not add a profile layer, warns, and the
// plugin silently does nothing.

const PACKAGE_ROOT = fileURLToPath(new URL('..', import.meta.url))

/** Nearest ancestor holding `.git`, or undefined outside a checkout. */
function repoRoot(from) {
  for (let dir = from; ; dir = dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir
    if (dirname(dir) === dir) return undefined
  }
}

const REPO_ROOT = repoRoot(PACKAGE_ROOT)

check(
  'the package is the repo root, with the layer dsh loads',
  { skip: REPO_ROOT === undefined && 'not a git checkout' },
  () => {
    strictEqual(resolve(PACKAGE_ROOT), resolve(REPO_ROOT), 'a nested package installs as a placeholder')
    const manifest = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8'))
    ok(manifest.dsh?.bundle?.patch, 'dsh.bundle.patch is what makes it a profile layer')
    ok(existsSync(join(PACKAGE_ROOT, manifest.main)), `main entry ${manifest.main} exists`)
    ok(existsSync(join(PACKAGE_ROOT, manifest.dsh.bundle.patch)), 'bundle patch exists')
  },
)

// --- release hygiene: version tags only -----------------------------------
// The README advertises a pinned tag, so it must name the version the manifest
// actually carries (a stale tag installs a different release, or nothing), and
// the release workflow must publish version tags only.

check('the README pins the manifest version and the workflow moves no extra tags', () => {
  const version = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')).version
  const pinned = [...readFileSync(join(PACKAGE_ROOT, 'README.md'), 'utf8').matchAll(/#(v\d+\.\d+\.\d+|latest)\b/g)].map((m) => m[1])
  deepStrictEqual(pinned, [`v${version}`], 'the README must pin exactly the manifest version, and never a moving tag')
  const workflow = readFileSync(join(PACKAGE_ROOT, '.github/workflows/release.yml'), 'utf8')
  ok(!/gh release|git tag -f/.test(workflow), 'the workflow must not create, move, or delete extra tags')
})

// --- validateBody: the /theme-picker/state PUT trust boundary -------------

check('accepts a full selection + boot payload', () => {
  deepStrictEqual(
    host.validateBody({ version: 1, selection: 'theme-picker/dracula', boot: { background: '#282a36', colorScheme: 'dark' } }),
    { version: 1, selection: 'theme-picker/dracula', boot: { background: '#282a36', colorScheme: 'dark' } },
  )
})

check('accepts a null selection with no boot', () => {
  deepStrictEqual(host.validateBody({ version: 1, selection: null }), { version: 1, selection: null })
})

check('accepts an omitted selection as null', () => {
  deepStrictEqual(host.validateBody({ version: 1 }), { version: 1, selection: null })
})

check('drops an optional boot when absent', () => {
  deepStrictEqual(host.validateBody({ version: 1, selection: 'theme-picker/catppuccin-mocha' }), { version: 1, selection: 'theme-picker/catppuccin-mocha' })
})

for (const [name, value] of [
  ['rejects a wrong version', { version: 2, selection: null }],
  ['rejects a non-string selection', { version: 1, selection: 42 }],
  ['rejects another plugin\'s theme id', { version: 1, selection: 'catppuccin-mocha' }],
  ['rejects a bare id without the plugin prefix', { version: 1, selection: 'dracula' }],
  ['rejects an over-long id', { version: 1, selection: `theme-picker/${'a'.repeat(80)}` }],
  ['rejects an id with invalid characters', { version: 1, selection: 'theme-picker/foo bar' }],
  ['rejects a non-object body', 'nope'],
  ['rejects an array body', [1]],
  ['rejects a non-hex boot background', { version: 1, selection: 'theme-picker/dracula', boot: { background: 'url(evil)', colorScheme: 'dark' } }],
  ['rejects a named-color boot background', { version: 1, selection: 'theme-picker/dracula', boot: { background: 'red', colorScheme: 'dark' } }],
  ['rejects an invalid boot colorScheme', { version: 1, selection: 'theme-picker/dracula', boot: { background: '#282a36', colorScheme: 'blue' } }],
]) {
  check(name, () => strictEqual(host.validateBody(value), null))
}

// --- durable state file -----------------------------------------------------

// Test bodies run after the module finishes evaluating, so the temp home and
// DSH_HOME live in the suite's hooks, not at module top level.
describe('durable state file', () => {
  let home
  let previousHome
  before(() => {
    home = mkdtempSync(join(tmpdir(), 'dsh-theme-picker-test-'))
    previousHome = process.env.DSH_HOME
    process.env.DSH_HOME = home
  })
  after(() => {
    process.env.DSH_HOME = previousHome
    rmSync(home, { recursive: true, force: true })
  })

  check('missing state reads as null', () => strictEqual(host.readDurableState(), null))

  check('write then read roundtrips', () => {
    host.writeDurableState({ version: 1, selection: 'theme-picker/catppuccin-latte', boot: { background: '#eff1f5', colorScheme: 'light' } })
    deepStrictEqual(host.readDurableState(), { version: 1, selection: 'theme-picker/catppuccin-latte', boot: { background: '#eff1f5', colorScheme: 'light' } })
  })

  check('corrupt state reads as null', () => {
    writeFileSync(join(home, 'theme-picker-state.json'), '{not json', 'utf8')
    strictEqual(host.readDurableState(), null)
  })

  check('state that fails validation reads as null', () => {
    writeFileSync(join(home, 'theme-picker-state.json'), JSON.stringify({ version: 1, selection: 'someone-elses/theme' }), 'utf8')
    strictEqual(host.readDurableState(), null)
  })
})

// --- boot style -------------------------------------------------------------

check('no state or no boot yields no boot style', () => {
  strictEqual(host.bootStyleFor(null), undefined)
  strictEqual(host.bootStyleFor({ version: 1, selection: null }), undefined)
  strictEqual(host.bootStyleFor({ version: 1, selection: 'theme-picker/dracula' }), undefined)
})

check('a boot payload yields a scoped style with only hex + scheme values', () => {
  const css = host.bootStyleFor({ version: 1, selection: 'theme-picker/dracula', boot: { background: '#20212b', colorScheme: 'dark' } })
  ok(typeof css === 'string' && css.includes('color-scheme:dark') && css.includes('background-color:#20212b'), `unexpected css: ${css}`)
})
