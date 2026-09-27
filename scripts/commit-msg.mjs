/**
 * Conventional-Commits check for a commit message.
 *
 * `.githooks/commit-msg` runs this on the message git is about to record, and
 * `test/state.mjs` covers the same function, so the rule and its tests cannot
 * drift apart. Only the subject line is judged: the type is what makes the log
 * filterable and the changelog minable, while a rule about the body would be a
 * style debate nobody wins.
 *
 *   node scripts/commit-msg.mjs .git/COMMIT_EDITMSG
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * The Conventional Commits types, lower-case in the subject. `test/state.mjs`
 * spells this list out again on purpose: a test that enumerates it here would
 * shrink with it and never notice a type going missing.
 */
const TYPES = ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']

/** Subjects git composes itself: merges, reverts, and autosquash fixups. */
const GENERATED = /^(?:Merge |Revert "|(?:fixup|squash|amend)! )/

/** `<type>`, an optional `(<scope>)`, an optional `!`, then `: <description>`. */
const SUBJECT = new RegExp(`^(?:${TYPES.join('|')})(?:\\([^()\\s]+\\))?!?: \\S.*$`)

/**
 * What is wrong with a commit message, or null when nothing is.
 * @param message - the whole message file, comment lines and all.
 * @returns the complaint, or null.
 */
export function commitProblem(message) {
  // git's cleanup usually strips comments first, but `--cleanup=verbatim` and
  // `-v` both put more in the file than the message, so find the subject here.
  const subject = message.split('\n').find((line) => line.trim() !== '' && !line.startsWith('#'))
  if (subject === undefined) return 'no subject line'
  const line = subject.trim()
  if (SUBJECT.test(line) || GENERATED.test(line)) return null
  return `"${line}" is not "<type>(<scope>): <description>", with type one of ${TYPES.join(', ')}`
}

function main() {
  const file = process.argv[2]
  if (file === undefined) {
    console.error('usage: node scripts/commit-msg.mjs <commit-message-file>')
    process.exitCode = 1
    return
  }
  const problem = commitProblem(readFileSync(file, 'utf8'))
  if (problem === null) return
  console.error(`commit-msg: ${problem}`)
  console.error('commit-msg: see "Development" in README.md — bypass with `git commit --no-verify`')
  process.exitCode = 1
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
