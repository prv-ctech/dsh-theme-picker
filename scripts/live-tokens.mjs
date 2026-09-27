/**
 * Live theme-token names of the installed DSH build.
 *
 * The theme plugin ships its palettes as inline CSS inside the client bundle:
 * the base palette (`design_platform_css_default`) is the token set a theme
 * overrides, and the other stylesheets (onboarding, scrollbar, shiki, base)
 * declare the rest of the surface. Both the table generator and the tests read
 * the installed build through here, so the committed tables are checked
 * against the same source they were generated from.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { dshPkgDir } from './dsh-install.mjs'

/** Directory of the installed `@deepseek-ai/dsh-client-ui-theme` package. */
export function themePkgDir() {
  return process.env.DSH_THEME_PKG ?? dshPkgDir('@deepseek-ai/dsh-client-ui-theme')
}

/** The package's client bundle split into its inline stylesheets. */
function cssBlobs() {
  const source = readFileSync(join(themePkgDir(), 'lib', 'client.js'), 'utf8')
  const blobs = []
  // One double-quoted JS string literal (the CSS itself carries escaped quotes,
  // so the terminator is an unescaped quote followed by the semicolon).
  for (const [, name, raw] of source.matchAll(/var\s+([A-Za-z0-9_$]+_css_default)\s*=\s*"((?:[^"\\]|\\.)*)";/g)) {
    blobs.push([name, JSON.parse(`"${raw}"`)])
  }
  if (blobs.length === 0) throw new Error(`no stylesheets found in ${themePkgDir()}/lib/client.js`)
  return blobs
}

/** Token names declared by one stylesheet blob. */
function namesOf(css) {
  return [...css.matchAll(/--[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0])
}

/** Every token name the installed build declares, sorted. */
export function liveTokens() {
  const names = new Set()
  for (const [, css] of cssBlobs()) for (const name of namesOf(css)) names.add(name)
  return [...names].sort()
}

/** Token names of the base palette — the set a theme should cover. */
export function baseTokens() {
  const blob = cssBlobs().find(([name]) => name === 'design_platform_css_default')
  if (blob === undefined) throw new Error('base palette stylesheet not found')
  return [...new Set(namesOf(blob[1]))].sort()
}
