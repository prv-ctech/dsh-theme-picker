/**
 * Release guard: a version tag may only publish what CI already blessed.
 *
 * `release.yml` runs this before the pack and publish steps. For the commit the
 * tag points at, two things have to hold:
 *
 *   1. It is an ancestor of `main` — a tag on a stray branch publishes work that
 *      never went through the push gate.
 *   2. CI succeeded on that exact commit. The release is what makes an artifact
 *      permanent, so the run has to be green before it, not after it.
 *
 * Both read state only the runner has (the git graph, the Actions API), so the
 * CLI half does the I/O and the judgement sits in a pure function that
 * `test/state.mjs` covers. Every failure path exits non-zero: an unread status
 * refuses the release rather than assuming the best.
 *
 *   GH_TOKEN=… node scripts/release-guard.mjs v0.1.3
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/** The workflow whose green run a tag needs. */
const WORKFLOW = 'ci.yml'

/**
 * Why a commit is not cleared for release, or null when it is.
 * @param runs - workflow runs, as the Actions API returns them.
 * @param sha - the commit the tag points at.
 * @returns the complaint, or null.
 */
export function ciProblem(runs, sha) {
  const mine = runs.filter((run) => run.head_sha === sha)
  const short = sha.slice(0, 7)
  if (mine.length === 0) return `CI has not run on ${short} — push it to main and let the gate pass first`
  if (mine.some((run) => run.status !== 'completed')) return `CI is still running on ${short}`
  if (mine.some((run) => run.conclusion === 'success')) return null
  return `CI on ${short} concluded ${mine.map((run) => run.conclusion ?? run.status).join(', ')}`
}

/** Run git, or throw with its own words. */
function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`)
  return result.stdout.trim()
}

function fail(message) {
  console.error(`release-guard: ${message}`)
  process.exitCode = 1
}

async function main() {
  const tag = process.argv[2]
  if (!tag) {
    fail('usage: node scripts/release-guard.mjs <tag>')
    return
  }

  try {
    git(['rev-parse', '--verify', 'origin/main'])
  } catch {
    fail('origin/main is not fetched — fetch it before running this')
    return
  }
  // Exit 1 means "no", and anything else means git could not tell: a tag we
  // cannot place is not a tag we publish.
  const ancestry = spawnSync('git', ['merge-base', '--is-ancestor', 'HEAD', 'origin/main'])
  if (ancestry.status !== 0) {
    fail(`${tag} points at a commit that is not on main`)
    return
  }

  const sha = git(['rev-parse', 'HEAD'])
  const repo = process.env.GITHUB_REPOSITORY
  const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN
  if (repo === undefined || token === undefined) {
    fail('GITHUB_REPOSITORY and a token are required')
    return
  }

  const url = `https://api.github.com/repos/${repo}/actions/workflows/${WORKFLOW}/runs?head_sha=${sha}&per_page=20`
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'dsh-theme-picker-release-guard'
    }
  })
  if (!response.ok) {
    fail(`the GitHub API answered ${response.status} — refusing to publish on a status nobody read`)
    return
  }

  const { workflow_runs: runs = [] } = await response.json()
  const problem = ciProblem(runs, sha)
  if (problem !== null) {
    fail(problem)
    return
  }
  console.log(`release-guard: ${tag} is on main, and CI passed on ${sha.slice(0, 7)}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
