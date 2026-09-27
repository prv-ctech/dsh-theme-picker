/**
 * Generate the token tables embedded in `lib/client.js`.
 *
 * The client bundle is one self-contained file (the module loader runs it as a
 * single factory), so the reference tables live inline. This script reads the
 * researched tables in `.superpowers/research/` (untracked local research; see
 * the README credits for the upstream sources), keeps every token the
 * installed build actually declares (a token this build no longer knows is
 * dead weight), and rewrites the block between the generated-tables markers.
 *
 *   node scripts/build-tables.mjs           # rewrite
 *   node scripts/build-tables.mjs --check   # fail when stale, write nothing
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { liveTokens } from './live-tokens.mjs'

const CLIENT = fileURLToPath(new URL('../lib/client.js', import.meta.url))
const RESEARCH = fileURLToPath(new URL('../.superpowers/research/', import.meta.url))

/** Catalog order: Dracula, then the Catppuccin flavors light → dark. */
export const KEYS = [
  'dracula',
  'catppuccin-latte',
  'catppuccin-frappe',
  'catppuccin-macchiato',
  'catppuccin-mocha',
]

const BEGIN = '\t\t// #region generated tables — node scripts/build-tables.mjs'
const END = '\t\t// #endregion generated tables'

/**
 * The researched tables, filtered to tokens the installed build declares.
 * @returns {Record<string, {name: string, colorScheme: 'light'|'dark', tokens: Record<string,string>}>}
 */
export function referenceTables() {
  const live = new Set(liveTokens())
  const tables = {}
  for (const key of KEYS) {
    const source = JSON.parse(readFileSync(`${RESEARCH}${key}.json`, 'utf8'))
    const tokens = {}
    for (const name of Object.keys(source.tokens).sort()) {
      if (live.has(name)) tokens[name] = source.tokens[name]
    }
    tables[key] = { name: source.name, colorScheme: source.colorScheme, tokens }
  }
  return tables
}

/** The generated block: one token per line so reviews and diffs stay readable. */
export function renderBlock(tables) {
  const lines = [
    BEGIN,
    '\t\t/**',
    '\t\t * Reference theme tokens (MIT-licensed Dracula and Catppuccin mappings;',
    '\t\t * see the README credits), filtered to the token names the installed',
    '\t\t * build declares. The base-palette tokens these tables miss are filled',
    '\t\t * from each palette at load time.',
    '\t\t */',
    '\t\tconst TABLES = {',
  ]
  for (const key of KEYS) {
    const { name, colorScheme, tokens } = tables[key]
    lines.push(`\t\t\t${JSON.stringify(key)}: {`)
    lines.push(`\t\t\t\tname: ${JSON.stringify(name)},`)
    lines.push(`\t\t\t\tcolorScheme: ${JSON.stringify(colorScheme)},`)
    lines.push('\t\t\t\ttokens: {')
    for (const [token, value] of Object.entries(tokens)) {
      lines.push(`\t\t\t\t\t${JSON.stringify(token)}: ${JSON.stringify(value)},`)
    }
    lines.push('\t\t\t\t},')
    lines.push('\t\t\t},')
  }
  lines.push('\t\t}')
  lines.push(END)
  return lines.join('\n')
}

/** Bundle text with the generated block replaced. */
export function withTables(source, block) {
  const from = source.indexOf(BEGIN)
  const to = source.indexOf(END)
  if (from === -1 || to === -1) throw new Error(`generated-tables markers not found in ${CLIENT}`)
  return `${source.slice(0, from)}${block}${source.slice(to + END.length)}`
}

function main() {
  const check = process.argv.includes('--check')
  const tables = referenceTables()
  const source = readFileSync(CLIENT, 'utf8')
  const next = withTables(source, renderBlock(tables))
  const counts = KEYS.map((key) => `${key}=${Object.keys(tables[key].tokens).length}`).join(' ')
  if (next === source) {
    console.log(`tables up to date (${counts})`)
    return
  }
  if (check) {
    console.error(`tables are stale — run: node scripts/build-tables.mjs (${counts})`)
    process.exitCode = 1
    return
  }
  writeFileSync(CLIENT, next)
  console.log(`tables rewritten (${counts})`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
