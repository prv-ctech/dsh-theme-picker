/**
 * Client-half checks for dsh-theme-picker.
 *
 * The bundle is loaded the way the Harness loads it — through
 * `window.__ModuleLoader__.load({ id, factory })` — so this test fails on a
 * bundle that does not register, on stale generated tables, on tokens the
 * installed build no longer declares, and on a theme that misses base-palette
 * tokens. A fake client context then drives `apply()`: registration, the
 * settings tab, selection, the adopt-clobber re-assert, persistence, and the
 * Default restore.
 *
 *   node test/themes.mjs
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KEYS, referenceTables } from '../../scripts/build-tables.mjs'
import { baseTokens, liveTokens } from '../../scripts/live-tokens.mjs'

const BUNDLE = new URL('../lib/client.js', import.meta.url)

/**
 * Stand-in for `@deepseek-ai/dsh-client-store`: the shipped engine inlines
 * zustand/immer, so the installed module is not importable in Node. This keeps
 * the contract the plugin uses — `defineStore({init, actions})` returning a
 * handle whose `create()` exposes `actions`, `getSnapshot`, and `subscribe`.
 */
const storeStub = {
  defineStore(decl) {
    return {
      spec: decl,
      create() {
        let snapshot = decl.init()
        const listeners = new Set()
        const actions = {}
        for (const key of Object.keys(decl.actions)) {
          actions[key] = (...params) => {
            snapshot = { ...snapshot }
            decl.actions[key](snapshot, ...params)
            for (const listener of listeners) listener()
          }
        }
        return {
          actions,
          getSnapshot: () => snapshot,
          subscribe: (listener) => {
            listeners.add(listener)
            return () => listeners.delete(listener)
          },
        }
      },
    }
  },
}

const checks = []
function check(name, fn) {
  checks.push([name, fn])
}

/* ------------------------------- bundle load ------------------------------- */

/** Load the bundle through a stub module loader, as the shell does. */
let loads = 0
async function loadBundle() {
  const registrations = []
  const previous = globalThis.window
  globalThis.window = { __ModuleLoader__: { load: (registration) => registrations.push(registration) } }
  try {
    await import(`${BUNDLE.href}?load=${loads += 1}`)
  } finally {
    globalThis.window = previous
  }
  assert.equal(registrations.length, 1, 'bundle must register exactly one factory')
  const [registration] = registrations
  assert.equal(registration.id, 'dsh-theme-picker', 'factory id must equal the package name')
  const react = {
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
  }
  const required = []
  const bundle = registration.factory((specifier) => {
    required.push(specifier)
    if (specifier === 'react') return react
    if (specifier === '@deepseek-ai/dsh-client-store') return storeStub
    throw new Error(`unexpected require("${specifier}")`)
  })
  return { bundle, required }
}

/* ------------------------------- fake client ------------------------------ */

/** Minimal client context: theme service, locale, slots, logger, effects. */
function fakeCtx({ preference = 'system' } = {}) {
  const events = new Map()
  const state = { preference, scheme: preference === 'light' ? 'light' : 'dark', revision: 0 }
  const themes = new Map()
  const registrations = []
  const effects = []
  const ctx = {
    effects,
    registrations,
    listeners: events,
    logger: { warn: (message) => ctx.warnings.push(message) },
    warnings: [],
    theme: {
      register(definition) {
        if (themes.has(definition.id)) throw new Error(`theme "${definition.id}" is already registered`)
        themes.set(definition.id, definition)
        state.revision += 1
        return () => themes.delete(definition.id)
      },
      setTheme(id) {
        if (id !== 'system' && !themes.has(id) && !['light', 'dark'].includes(id)) {
          throw new Error(`theme "${id}" is not registered`)
        }
        if (state.preference === id) return
        state.preference = id
        state.revision += 1
        ctx.theme.publish()
      },
      getTheme() {
        const resolved = state.preference === 'system' ? state.scheme : state.preference
        const active = themes.get(resolved) ?? { id: resolved, colorScheme: resolved === 'light' ? 'light' : 'dark', tokens: {} }
        return { preference: state.preference, active, themes: [...themes.values()], revision: state.revision, fontSize: 14 }
      },
      /** Simulate the runtime's built-in preference adoption (a clobber). */
      adopt(id) {
        state.preference = id
        state.revision += 1
        ctx.theme.publish()
      },
      publish() {
        for (const listener of events.get('theme/change') ?? []) listener(ctx.theme.getTheme())
      },
    },
    locale: {
      register: () => () => {},
      bind: () => (key) => `t:${key}`,
    },
    slots: {
      inject: (name, factory) => {
        const dispose = factory()
        effects.push(() => dispose?.())
        return dispose
      },
      register: (options) => {
        registrations.push(options)
        return () => {}
      },
    },
    effect: (fn) => {
      const dispose = fn()
      effects.push(() => dispose?.())
    },
    on: (event, listener) => {
      const list = events.get(event) ?? []
      list.push(listener)
      events.set(event, list)
      return () => {
        const at = list.indexOf(listener)
        if (at !== -1) list.splice(at, 1)
      }
    },
  }
  return ctx
}

/** Install the browser globals the client half reads, and capture timers. */
function withBrowser({ storage = {}, fetchImpl } = {}) {
  const previous = {
    localStorage: globalThis.localStorage,
    fetch: globalThis.fetch,
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
  }
  const timers = []
  const cancelled = new Set()
  globalThis.localStorage = {
    getItem: (key) => (key in storage ? storage[key] : null),
    setItem: (key, value) => {
      storage[key] = value
    },
    removeItem: (key) => {
      delete storage[key]
    },
  }
  const requests = []
  globalThis.fetch = async (url, init) => {
    requests.push({ url, init })
    const body = fetchImpl === undefined ? {} : await fetchImpl(url, init)
    return { ok: true, json: async () => body }
  }
  globalThis.setTimeout = (fn, ms) => {
    timers.push({ fn, ms })
    return timers.length
  }
  globalThis.clearTimeout = (handle) => cancelled.add(handle)
  return {
    requests,
    timers,
    storage,
    cancelled,
    restore() {
      globalThis.localStorage = previous.localStorage
      globalThis.fetch = previous.fetch
      globalThis.setTimeout = previous.setTimeout
      globalThis.clearTimeout = previous.clearTimeout
    },
  }
}

/* --------------------------------- checks --------------------------------- */

check('generated tables are fresh and cover the live surface', async () => {
  const { bundle } = await loadBundle()
  const expected = referenceTables()
  const live = new Set(liveTokens())
  const base = baseTokens()
  assert.deepEqual(bundle.SKINS.map((skin) => skin.id), KEYS.map((key) => `theme-picker/${key}`))
  assert.equal(new Set(bundle.SKINS.map((skin) => skin.id)).size, KEYS.length, 'ids must be unique')
  for (const [index, key] of KEYS.entries()) {
    const skin = bundle.SKINS[index]
    const table = expected[key]
    assert.equal(skin.name, table.name)
    assert.ok(['light', 'dark'].includes(skin.colorScheme), `${key}: colorScheme`)
    const embedded = Object.fromEntries(
      Object.entries(skin.tokens).filter(([name]) => name in table.tokens),
    )
    assert.deepEqual(embedded, table.tokens, `${key}: embedded table drifted — run scripts/build-tables.mjs`)
    for (const name of Object.keys(skin.tokens)) {
      assert.ok(live.has(name), `${key}: ${name} is not a token of the installed build`)
      assert.equal(typeof skin.tokens[name], 'string')
      assert.ok(skin.tokens[name].length > 0, `${key}: ${name} is empty`)
    }
    for (const name of base) assert.ok(name in skin.tokens, `${key}: base token ${name} missing`)
    assert.match(skin.background, /^#[0-9a-fA-F]{3,8}$/, `${key}: boot background must be a hex color`)
    assert.equal(skin.tokens['--dsw-alias-bg-base'], skin.background)
    assert.equal(skin.swatch.length, 4)
  }
})

check('apply registers the catalog and the settings tab', async () => {
  const { bundle, required } = await loadBundle()
  const browser = withBrowser()
  const ctx = fakeCtx()
  try {
    bundle.apply(ctx)
  } finally {
    browser.restore()
  }
  assert.deepEqual(required, ['react', '@deepseek-ai/dsh-client-store'])
  assert.deepEqual(bundle.inject, ['slots', 'locale', 'theme'])
  assert.deepEqual(ctx.warnings, [])
  const tab = ctx.registrations.find((entry) => entry.name === 'settings.section')
  assert.ok(tab !== undefined, 'settings.section entry registered')
  assert.equal(tab.id, 'theme-picker')
  assert.equal(tab.order, 5)
  assert.equal(tab.locale, 'theme-picker')
  assert.equal(typeof tab.label, 'function')
  assert.equal(typeof tab.inject, 'function')
  const face = tab.inject(tab.store.create().actions)
  assert.equal(typeof face.pick, 'function')
})

check('selection applies, persists to both layers, and Default restores', async () => {
  const { bundle } = await loadBundle()
  const storage = {}
  const browser = withBrowser({ storage })
  const ctx = fakeCtx()
  try {
    bundle.apply(ctx)
    const tab = ctx.registrations[0]
    const instance = tab.store.create()
    const face = tab.inject(instance.actions)
    assert.equal(instance.getSnapshot().selection, 'default')

    face.pick('theme-picker/dracula')
    assert.equal(ctx.theme.getTheme().preference, 'theme-picker/dracula')
    assert.equal(instance.getSnapshot().selection, 'theme-picker/dracula')
    assert.equal(instance.getSnapshot().scheme, 'dark')
    const stored = JSON.parse(storage['dsh-theme-picker/selection'])
    assert.deepEqual(stored, {
      version: 1,
      selection: 'theme-picker/dracula',
      boot: { background: '#20212b', colorScheme: 'dark' },
    })
    // The debounced durable write carries the same payload to the host route.
    const put = browser.timers.find((timer) => timer.ms === 300)
    assert.ok(put !== undefined, 'a debounced PUT is scheduled')
    put.fn()
    await Promise.resolve()
    const request = browser.requests.find((entry) => entry.init?.method === 'PUT')
    assert.equal(request.url, '/theme-picker/state')
    assert.deepEqual(JSON.parse(request.init.body), stored)

    face.pick('default')
    assert.equal(ctx.theme.getTheme().preference, 'system')
    assert.equal(instance.getSnapshot().selection, 'default')
    assert.deepEqual(JSON.parse(storage['dsh-theme-picker/selection']), { version: 1, selection: null })
  } finally {
    browser.restore()
  }
})

check('an adoption clobber is re-asserted, an explicit pick is not', async () => {
  const { bundle } = await loadBundle()
  const browser = withBrowser()
  const ctx = fakeCtx()
  try {
    bundle.apply(ctx)
    const tab = ctx.registrations[0]
    const face = tab.inject(tab.store.create().actions)
    face.pick('theme-picker/catppuccin-mocha')
    assert.equal(ctx.theme.getTheme().preference, 'theme-picker/catppuccin-mocha')

    // The runtime re-adopts the durable built-in preference without asking us.
    ctx.theme.adopt('dark')
    assert.equal(ctx.theme.getTheme().preference, 'dark')
    const reassert = browser.timers.find((timer) => timer.ms === 0)
    assert.ok(reassert !== undefined, 're-assert scheduled from a macrotask')
    reassert.fn()
    assert.equal(ctx.theme.getTheme().preference, 'theme-picker/catppuccin-mocha')

    // An explicit built-in pick through the wrapper yields instead.
    browser.timers.length = 0
    ctx.theme.setTheme('light')
    assert.equal(ctx.theme.getTheme().preference, 'light')
    assert.equal(browser.timers.filter((timer) => timer.ms === 0).length, 0)
  } finally {
    browser.restore()
  }
})

check('another plugin taking the preference drops our selection', async () => {
  const { bundle } = await loadBundle()
  const browser = withBrowser()
  const ctx = fakeCtx()
  try {
    bundle.apply(ctx)
    const tab = ctx.registrations[0]
    const face = tab.inject(tab.store.create().actions)
    face.pick('theme-picker/catppuccin-latte')
    assert.equal(ctx.theme.getTheme().preference, 'theme-picker/catppuccin-latte')

    ctx.theme.register({ id: 'other-plugin/theme', colorScheme: 'dark', tokens: {} })
    ctx.theme.setTheme('other-plugin/theme')
    assert.equal(ctx.theme.getTheme().preference, 'other-plugin/theme')
    const stored = JSON.parse(browser.storage['dsh-theme-picker/selection'])
    assert.deepEqual(stored, { version: 1, selection: null })
  } finally {
    browser.restore()
  }
})

check('a stored selection is restored from localStorage, and from the file when absent', async () => {
  const { bundle } = await loadBundle()
  const storage = { 'dsh-theme-picker/selection': JSON.stringify({ version: 1, selection: 'theme-picker/catppuccin-frappe' }) }
  const browser = withBrowser({ storage })
  const ctx = fakeCtx()
  try {
    bundle.apply(ctx)
    assert.equal(ctx.theme.getTheme().preference, 'theme-picker/catppuccin-frappe')
  } finally {
    browser.restore()
  }

  const empty = {}
  const second = withBrowser({ storage: empty, fetchImpl: async () => ({ version: 1, selection: 'theme-picker/catppuccin-macchiato' }) })
  const fileCtx = fakeCtx()
  try {
    bundle.apply(fileCtx)
    // Nothing is written until the file answers: an empty browser starts Default.
    assert.equal(empty['dsh-theme-picker/selection'], undefined)
    await new Promise((resolve) => setImmediate(resolve))
    await new Promise((resolve) => setImmediate(resolve))
    assert.equal(fileCtx.theme.getTheme().preference, 'theme-picker/catppuccin-macchiato')
    assert.equal(JSON.parse(empty['dsh-theme-picker/selection']).selection, 'theme-picker/catppuccin-macchiato')
  } finally {
    second.restore()
  }
})

check('a selection of an unregistered theme stays Default', async () => {
  const { bundle } = await loadBundle()
  const storage = { 'dsh-theme-picker/selection': JSON.stringify({ version: 1, selection: 'theme-picker/nope' }) }
  const browser = withBrowser({ storage })
  const ctx = fakeCtx({ preference: 'light' })
  try {
    bundle.apply(ctx)
    assert.equal(ctx.theme.getTheme().preference, 'light')
  } finally {
    browser.restore()
  }
})

check('the bundle source keeps its markers and the host half still parses', async () => {
  const source = readFileSync(BUNDLE, 'utf8')
  assert.ok(source.includes('// #region generated tables'), 'generated-tables markers present')
  assert.ok(source.includes('// #endregion generated tables'))
  // The host half is a separate Node module with its own suite (test/state.mjs).
  assert.ok(readFileSync(new URL('../lib/index.js', import.meta.url), 'utf8').includes('export function apply'))
})

/* ---------------------------------- run ----------------------------------- */

let failed = 0
for (const [name, fn] of checks) {
  try {
    await fn()
    console.log(`ok   ${name}`)
  } catch (error) {
    failed += 1
    console.error(`FAIL ${name}`)
    console.error(error)
  }
}
console.log(`${checks.length - failed}/${checks.length} checks passed`)
if (failed > 0) process.exitCode = 1
