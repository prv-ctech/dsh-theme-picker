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
const { commitProblem } = await import('../scripts/commit-msg.mjs')
const { ciProblem } = await import('../scripts/release-guard.mjs')

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
  }
)

// --- release hygiene: version tags only -----------------------------------
// The README advertises a pinned tag, so it must name the version the manifest
// actually carries (a stale tag installs a different release, or nothing), and
// the release workflow must publish version tags only.

check('the README pins the manifest version and the workflow moves no extra tags', () => {
  const version = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')).version
  const pinned = [...readFileSync(join(PACKAGE_ROOT, 'README.md'), 'utf8').matchAll(/#(v\d+\.\d+\.\d+|latest)\b/g)].map(
    (m) => m[1]
  )
  deepStrictEqual(pinned, [`v${version}`], 'the README must pin exactly the manifest version, and never a moving tag')
  const workflow = readFileSync(join(PACKAGE_ROOT, '.github/workflows/release.yml'), 'utf8')
  ok(!/gh release|git tag -f/.test(workflow), 'the workflow must not create, move, or delete extra tags')
})

// --- release guard: a tag may only publish what CI blessed ------------------
// The guard reads the git graph and the Actions API, so its verdict lives in a
// pure function. A wrong verdict here either blocks a good release or publishes
// an unverified one, and the tag is the point of no return for both.

const RELEASED_SHA = '9a96aeb1775ffa17703e5dbf0d4e5b7f71996073'
const OTHER_SHA = '945e2c88219e549f895f519919dbf276b2b35190'

check('a commit with a green CI run is cleared for release', () => {
  strictEqual(ciProblem([{ head_sha: RELEASED_SHA, status: 'completed', conclusion: 'success' }], RELEASED_SHA), null)
})

check('a commit whose CI is unfinished, failed, or unrun is not cleared', () => {
  ok(
    ciProblem([{ head_sha: RELEASED_SHA, status: 'in_progress', conclusion: null }], RELEASED_SHA)?.includes(
      'still running'
    )
  )
  ok(
    ciProblem([{ head_sha: RELEASED_SHA, status: 'completed', conclusion: 'failure' }], RELEASED_SHA)?.includes(
      'failure'
    )
  )
  ok(ciProblem([], RELEASED_SHA)?.includes('has not run'))
})

check('a green run on a different commit does not clear this one', () => {
  ok(ciProblem([{ head_sha: OTHER_SHA, status: 'completed', conclusion: 'success' }], RELEASED_SHA) !== null)
})

check('the release workflow guards before it packs', () => {
  const workflow = readFileSync(join(PACKAGE_ROOT, '.github/workflows/release.yml'), 'utf8')
  const guard = workflow.indexOf('scripts/release-guard.mjs')
  ok(guard !== -1, 'release.yml must run the release guard')
  ok(guard < workflow.indexOf('Pack the plugin'), 'the guard has to run before the pack step, or it guards nothing')
})

// A version bump and its changelog entry belong in the same commit. At tag time
// release.yml lifts this section into the release body and fails when it is
// missing, so asserting it here moves that failure to the push that caused it
// rather than to the tag, where the fix is a rewrite of a published release.

check('the manifest version has a changelog entry', () => {
  const version = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')).version
  const changelog = readFileSync(join(PACKAGE_ROOT, 'CHANGELOG.md'), 'utf8')
  ok(changelog.includes('\n## [Unreleased]'), 'CHANGELOG.md needs an [Unreleased] section')
  ok(changelog.includes(`\n## [${version}]`), `CHANGELOG.md needs a section for ${version}`)
})

// --- commit subjects: conventional prefixes --------------------------------
// The log is read by humans, filtered by tooling, and mined when the changelog
// is written, so a subject carries its type. The rule is a function rather than
// a shell `case` so this suite checks the same code `.githooks/commit-msg` runs
// on the message git is about to record.

// Spelled out rather than read from the module: a loop over the production
// list shrinks with it and cannot notice a type going missing.
for (const type of ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']) {
  check(`accepts a "${type}:" subject`, () => strictEqual(commitProblem(`${type}: do the thing`), null))
}

check('accepts a scope, a breaking marker, and both together', () => {
  strictEqual(commitProblem('chore(hooks): run the tests before committing'), null)
  strictEqual(commitProblem('feat!: drop the legacy token names'), null)
  strictEqual(commitProblem('docs(readme)!: rewrite the install steps'), null)
})

check('accepts what git itself writes', () => {
  strictEqual(commitProblem("Merge branch 'main' into hooks"), null)
  strictEqual(commitProblem('Merge pull request #4 from prv-ctech/hooks'), null)
  strictEqual(commitProblem('Revert "fix: keep the state file readable"'), null)
  strictEqual(commitProblem('fixup! fix: keep the state file readable'), null)
  strictEqual(commitProblem('squash! fix: keep the state file readable'), null)
})

check('reads the subject through the comments and diff git appends', () => {
  // `git commit -v` leaves the message, the comment block and a scissors
  // section in the same file; only the first line that is not a comment counts.
  const message = [
    'test: hold every skin to a contrast floor',
    '',
    '# Please enter the commit message for your changes.',
    '#',
    '# ------------------------ >8 ------------------------',
    'diff --git a/test/themes.mjs b/test/themes.mjs',
    '+fix: a diff line is not a subject'
  ].join('\n')
  strictEqual(commitProblem(message), null)
  // Blank lines ahead of the subject are skipped, not treated as the subject.
  strictEqual(commitProblem('\n\n   test: hold every skin to a contrast floor\n'), null)
  // So is a comment block ahead of it, which `commit.template` and
  // `--cleanup=verbatim` leave in place.
  strictEqual(commitProblem('# a template line\n\nfix: the state file\n'), null)
  ok(commitProblem('# a template line\nwip: more hooks\n') !== null, 'the template line was judged instead')
  ok(commitProblem('\n\n# only comments\n') !== null, 'a message with no subject was accepted')
})

for (const [name, message] of [
  ['a subject with no type', 'Added a contrast test'],
  ['a capitalised type', 'Fix: stop the clobber'],
  ['an unknown type', 'wip: more hooks'],
  ['a missing colon', 'fix the state file'],
  ['a missing space after the colon', 'fix:the state file'],
  ['an empty description', 'fix: '],
  ['a scope with a space in it', 'fix(two words): the state file'],
  ['an empty message', '']
]) {
  check(`rejects ${name}`, () => {
    const problem = commitProblem(message)
    ok(problem !== null, `${JSON.stringify(message)} was accepted`)
  })
}

check('the problem names the subject and the shape wanted', () => {
  const problem = commitProblem('wip: more hooks')
  ok(problem.includes('wip: more hooks'), problem)
  ok(problem.includes('feat'), problem)
})

// --- validateBody: the /theme-picker/state PUT trust boundary -------------

check('accepts a full selection + boot payload', () => {
  deepStrictEqual(
    host.validateBody({
      version: 1,
      selection: 'theme-picker/dracula',
      boot: { background: '#282a36', colorScheme: 'dark' }
    }),
    { version: 1, selection: 'theme-picker/dracula', boot: { background: '#282a36', colorScheme: 'dark' } }
  )
})

check('accepts a null selection with no boot', () => {
  deepStrictEqual(host.validateBody({ version: 1, selection: null }), { version: 1, selection: null })
})

check('accepts an omitted selection as null', () => {
  deepStrictEqual(host.validateBody({ version: 1 }), { version: 1, selection: null })
})

check('drops an optional boot when absent', () => {
  deepStrictEqual(host.validateBody({ version: 1, selection: 'theme-picker/catppuccin-mocha' }), {
    version: 1,
    selection: 'theme-picker/catppuccin-mocha'
  })
})

for (const [name, value] of [
  ['rejects a wrong version', { version: 2, selection: null }],
  ['rejects a non-string selection', { version: 1, selection: 42 }],
  ["rejects another plugin's theme id", { version: 1, selection: 'catppuccin-mocha' }],
  ['rejects a bare id without the plugin prefix', { version: 1, selection: 'dracula' }],
  ['rejects an over-long id', { version: 1, selection: `theme-picker/${'a'.repeat(80)}` }],
  ['rejects an id with invalid characters', { version: 1, selection: 'theme-picker/foo bar' }],
  ['rejects a non-object body', 'nope'],
  ['rejects an array body', [1]],
  [
    'rejects a non-hex boot background',
    { version: 1, selection: 'theme-picker/dracula', boot: { background: 'url(evil)', colorScheme: 'dark' } }
  ],
  [
    'rejects a named-color boot background',
    { version: 1, selection: 'theme-picker/dracula', boot: { background: 'red', colorScheme: 'dark' } }
  ],
  [
    'rejects an invalid boot colorScheme',
    { version: 1, selection: 'theme-picker/dracula', boot: { background: '#282a36', colorScheme: 'blue' } }
  ]
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
    host.writeDurableState({
      version: 1,
      selection: 'theme-picker/catppuccin-latte',
      boot: { background: '#eff1f5', colorScheme: 'light' }
    })
    deepStrictEqual(host.readDurableState(), {
      version: 1,
      selection: 'theme-picker/catppuccin-latte',
      boot: { background: '#eff1f5', colorScheme: 'light' }
    })
  })

  check('corrupt state reads as null', () => {
    writeFileSync(join(home, 'theme-picker-state.json'), '{not json', 'utf8')
    strictEqual(host.readDurableState(), null)
  })

  check('state that fails validation reads as null', () => {
    writeFileSync(
      join(home, 'theme-picker-state.json'),
      JSON.stringify({ version: 1, selection: 'someone-elses/theme' }),
      'utf8'
    )
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
  const css = host.bootStyleFor({
    version: 1,
    selection: 'theme-picker/dracula',
    boot: { background: '#20212b', colorScheme: 'dark' }
  })
  ok(
    typeof css === 'string' && css.includes('color-scheme:dark') && css.includes('background-color:#20212b'),
    `unexpected css: ${css}`
  )
})
