/**
 * dsh-theme-picker — host half tests (pure logic, no HTTP).
 *
 * Covers the PUT-body trust boundary (validation), the durable state file
 * roundtrip, and the boot-style derivation. Run: node test/state.mjs
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { deepStrictEqual, ok, strictEqual } from 'node:assert'
import { after, before, describe, test as check } from 'node:test'

const host = await import('../lib/index.js')

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
