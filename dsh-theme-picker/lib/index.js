/**
 * dsh-theme-picker — host half.
 *
 * One exact webServer route plus one index-injection subscription:
 *
 *   - `/theme-picker/state` (GET / PUT): durable theme selection in a small
 *     JSON file under `$DSH_HOME` (`theme-picker-state.json`), written
 *     atomically (temp + rename, mode 0600). The browser localStorage is
 *     the instant layer; this file survives fresh browsers, DSH Desktop's
 *     random per-launch port, and container/image updates when `$DSH_HOME`
 *     is a mounted volume.
 *
 *   - `webserver/index-inject`: while a theme with boot info is selected,
 *     a head style paints its base background and color scheme before any
 *     script runs, so a reload does not flash the default palette before
 *     the client plugin loads. The client writes the boot payload (hex
 *     background + scheme only) alongside the selection, keeping the theme
 *     catalog's single source of truth in the browser half.
 *
 * `webServer` is a hard inject dependency, so this half only activates
 * where the service is live (headless profiles stay inert).
 */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

export const name = 'dsh-theme-picker'
export const inject = ['webServer']

const STATE_PATH = '/theme-picker/state'
const STATE_FILENAME = 'theme-picker-state.json'
/** Largest accepted PUT body (the payload is two ids and a hex color). */
const MAX_BODY_BYTES = 4096
/** Selection ids this plugin may persist: its own namespaced theme ids. */
const SELECTION_RE = /^theme-picker\/[a-z0-9][a-z0-9-]{0,63}$/
/** Boot backgrounds are a plain CSS hex color — nothing else interpolates. */
const BOOT_COLOR_RE = /^#[0-9a-fA-F]{3,8}$/

function dshHome() {
  return process.env.DSH_HOME || join(homedir(), '.dsh')
}

function stateFilePath() {
  return join(dshHome(), STATE_FILENAME)
}

/**
 * Validate one `/theme-picker/state` payload at the trust boundary.
 * @param {unknown} parsed - the parsed PUT body.
 * @returns {{version: 1, selection: string | null, boot?: {background: string, colorScheme: 'light' | 'dark'}} | null}
 *   the normalized state, or null when the payload is rejected.
 */
export function validateBody(parsed) {
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null
  if (parsed.version !== 1) return null
  let selection = null
  if (parsed.selection !== undefined && parsed.selection !== null) {
    if (typeof parsed.selection !== 'string' || !SELECTION_RE.test(parsed.selection)) return null
    selection = parsed.selection
  }
  const state = { version: 1, selection }
  if (parsed.boot !== undefined && parsed.boot !== null) {
    if (typeof parsed.boot !== 'object' || Array.isArray(parsed.boot)) return null
    const { background, colorScheme } = parsed.boot
    if (typeof background !== 'string' || !BOOT_COLOR_RE.test(background)) return null
    if (colorScheme !== 'light' && colorScheme !== 'dark') return null
    state.boot = { background, colorScheme }
  }
  return state
}

/** Read the durable state; absent, corrupt, or invalid means none yet. */
export function readDurableState() {
  try {
    return validateBody(JSON.parse(readFileSync(stateFilePath(), 'utf8')))
  } catch {
    return null
  }
}

/** Write atomically: temp file + rename over the target (mode 0600 keeps
 *  the preference private; a failed rename leaves the previous file). */
export function writeDurableState(state) {
  const path = stateFilePath()
  mkdirSync(dirname(path), { recursive: true })
  const tmp = `${path}.tmp`
  writeFileSync(tmp, `${JSON.stringify(state)}\n`, { mode: 0o600 })
  renameSync(tmp, path)
}

/**
 * Derive the pre-plugin boot style for a state, if it carries boot info.
 * @param {{boot?: {background: string, colorScheme: 'light' | 'dark'}} | null} state
 * @returns {string | undefined} head CSS, or undefined to inject nothing.
 */
export function bootStyleFor(state) {
  if (state === null || typeof state !== 'object') return undefined
  const { boot } = state
  if (boot === undefined || boot === null) return undefined
  return `:root{color-scheme:${boot.colorScheme}}body{background-color:${boot.background}}`
}

/* ---------------------------------- http ----------------------------------- */

function json(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

/** Read one request body, refusing anything over the cap. */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/** Cordis entry: register the route and the boot injection, release both on teardown. */
export function apply(ctx) {
  const webServer = ctx.get('webServer')
  if (webServer === undefined) return
  const disposers = [
    webServer.register({
      kind: 'exact',
      path: STATE_PATH,
      handler: async (req, res) => {
        if (req.method === 'GET') {
          json(res, 200, readDurableState() ?? {})
          return
        }
        if (req.method === 'PUT') {
          try {
            const state = validateBody(JSON.parse(await readBody(req)))
            if (state === null) {
              json(res, 400, { ok: false, error: 'invalid theme-picker state' })
              return
            }
            writeDurableState(state)
            json(res, 200, { ok: true })
          } catch (error) {
            json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
          }
          return
        }
        json(res, 405, { ok: false, error: 'method not allowed' })
      },
    }),
  ]
  const offInject = ctx.on('webserver/index-inject', (table) => {
    const css = bootStyleFor(readDurableState())
    if (css !== undefined) table.push({ kind: 'style', text: css })
  })
  if (typeof offInject === 'function') disposers.push(offInject)
  ctx.effect(() => () => {
    for (const dispose of disposers) dispose()
  }, 'dsh-theme-picker: host route + boot injection')
}
