/**
 * Locate packages inside the installed DSH build.
 *
 * The dev scripts and tests read the running Harness as their source of truth
 * (live token names, the client store engine), so they need the install root.
 * `DSH_INSTALL` overrides that node_modules directory.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.env.DSH_INSTALL ?? '/usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules'

/**
 * Directory of one installed `@deepseek-ai/*` package.
 * @param name - package name, e.g. `@deepseek-ai/dsh-client-store`.
 * @returns the package directory.
 */
export function dshPkgDir(name) {
  const dir = join(ROOT, name)
  try {
    readFileSync(join(dir, 'package.json'))
  } catch {
    throw new Error(`${name} not found under ${ROOT}; set DSH_INSTALL to that node_modules directory`)
  }
  return dir
}
