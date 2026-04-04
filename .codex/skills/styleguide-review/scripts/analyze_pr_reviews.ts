#!/usr/bin/env bun

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

const DEFAULT_CONTEXT_LINES = 30
const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small'
const DEFAULT_SUMMARY_MODEL = 'gpt-5-mini'
const DEFAULT_SIMILARITY_THRESHOLD = 0.78
const DEFAULT_OUTPUT_DIR = 'styleguide-review/output'
const GITHUB_API_VERSION = '2022-11-28'
const OPENAI_REQUEST_CONCURRENCY = 10

type RawReviewComment = {
  id: string
  body: string
  path: string
  line: number | null
  original_line: number | null
  start_line: number | null
  original_start_line: number | null
  side: string | null
  start_side: string | null
  commit_id: string | null
  original_commit_id: string | null
  diff_hunk: string | null
  html_url: string
  created_at: string
  updated_at: string
  pr_number: number
  pr_created_at: string
  user: {
    login: string
  } | null
  subject_type?: string | null
  pull_request_url?: string
  pull_request_review_id?: number
}

type CommentContext = {
  commitSha: string | null
  startLine: number | null
  endLine: number | null
  codeFenceLabel: string
  snippet: string | null
  degradedReason: string | null
  source: 'file' | 'diff_hunk'
}

type EnrichedComment = {
  id: string
  prNumber: number | null
  filePath: string
  body: string
  htmlUrl: string
  createdAt: string
  updatedAt: string
  commentFileName: string
  commentFilePath: string
  diffHunk: string | null
  context: CommentContext
  embeddingInput: string
  contextPreview: string
}

type Cluster = {
  id: number
  itemIndexes: number[]
  sum: number[]
  centroid: number[]
}

type ClusterSummary = {
  title: string
  summary: string
  principle: string
}

type ScriptOptions = {
  repo: string
  user: string
  outputDir: string
  contextLines: number
  embeddingModel: string
  summaryModel: string
  similarityThreshold: number
  limit: number | null
  since: string | null
  prCreatedSince: string | null
}

type PullRequestListingNode = {
  number: number
  createdAt: string
  url: string
  author: {
    login: string
  } | null
}

type GraphQlPageInfo = {
  hasNextPage: boolean
  endCursor: string | null
}

type GraphQlPullRequestsResponse = {
  data?: {
    repository?: {
      pullRequests?: {
        pageInfo: GraphQlPageInfo
        nodes: PullRequestListingNode[]
      }
    }
  }
  errors?: Array<{ message: string }>
}

type GraphQlReviewThreadsResponse = {
  data?: {
    repository?: {
      pullRequest?: {
        number: number
        createdAt: string
        url: string
        reviewThreads?: {
          pageInfo: GraphQlPageInfo
          nodes: GraphQlReviewThreadNode[]
        }
      } | null
    }
  }
  errors?: Array<{ message: string }>
}

type GraphQlThreadCommentsResponse = {
  data?: {
    node?: {
      comments?: {
        pageInfo: GraphQlPageInfo
        nodes: GraphQlReviewCommentNode[]
      }
    } | null
  }
  errors?: Array<{ message: string }>
}

type GraphQlReviewThreadNode = {
  id: string
  comments: {
    pageInfo: GraphQlPageInfo
    nodes: GraphQlReviewCommentNode[]
  }
}

type GraphQlReviewCommentNode = {
  id: string
  body: string
  path: string
  line: number | null
  originalLine: number | null
  startLine: number | null
  originalStartLine: number | null
  diffHunk: string | null
  url: string
  createdAt: string
  updatedAt: string
  author: {
    login: string
  } | null
  commit: {
    oid: string
  } | null
  originalCommit: {
    oid: string
  } | null
}

async function main(): Promise<void> {
  await loadDotEnv()
  const options = parseCliArgs()
  ensureEnv('OPENAI_API_KEY')
  ensureGhAvailable()

  const repo = parseRepo(options.repo)
  const timestamp = buildTimestamp()
  const runDir = path.resolve(options.outputDir, timestamp)
  const commentsDir = path.join(runDir, 'comments')
  const clustersDir = path.join(runDir, 'clusters')

  logStep(`Preparing output directory at ${runDir}`)
  await mkdir(commentsDir, { recursive: true })
  await mkdir(clustersDir, { recursive: true })

  logStep(`Fetching review comments for ${repo.owner}/${repo.name} via GraphQL`)
  const rawComments = await fetchReviewCommentsGraphQl(
    repo.owner,
    repo.name,
    options,
  )
  logStep(
    `Fetched ${rawComments.length} matching inline review comments after GraphQL traversal`,
  )
  const filteredComments = filterComments(rawComments, options)
  logStep(
    `Selected ${filteredComments.length} comments authored by ${options.user}`,
  )

  const enrichedComments: EnrichedComment[] = []
  for (const [index, comment] of filteredComments.entries()) {
    logStep(
      `Resolving code context for comment ${index + 1}/${filteredComments.length} (#${comment.id})`,
    )
    const enriched = await enrichComment(
      comment,
      repo.owner,
      repo.name,
      options.contextLines,
      commentsDir,
    )
    enrichedComments.push(enriched)
    await writeFile(
      enriched.commentFilePath,
      renderCommentMarkdown(repo.owner, repo.name, enriched),
    )
  }

  let clusters: Cluster[] = []
  let clusterSummaries: Array<{
    cluster: Cluster
    summary: ClusterSummary
    fileName: string
  }> = []

  if (enrichedComments.length > 0) {
    logStep(
      `Creating embeddings for ${enrichedComments.length} comments with ${options.embeddingModel}`,
    )
    const embeddings = await createEmbeddings(
      enrichedComments.map((comment) => comment.embeddingInput),
      options.embeddingModel,
    )
    const allClusters = clusterEmbeddings(
      embeddings,
      options.similarityThreshold,
    )
    clusters = allClusters.filter((cluster) => cluster.itemIndexes.length > 2)
    logStep(
      `Created ${allClusters.length} clusters using similarity threshold ${options.similarityThreshold}; keeping ${clusters.length} clusters with at least 3 comments`,
    )
    logStep(
      `Summarizing ${clusters.length} clusters with up to ${OPENAI_REQUEST_CONCURRENCY} concurrent OpenAI requests`,
    )
    clusterSummaries = await mapWithConcurrency(
      clusters,
      OPENAI_REQUEST_CONCURRENCY,
      async (cluster, index) => {
        logStep(
          `Summarizing cluster ${cluster.id}/${clusters.length} with ${cluster.itemIndexes.length} comments`,
        )
        const items = cluster.itemIndexes.map(
          (itemIndex) => enrichedComments[itemIndex],
        )
        const summary = await summarizeCluster(
          items,
          repo.owner,
          repo.name,
          options.summaryModel,
        )
        const fileName = buildClusterFileName(cluster.id, summary.title)
        const filePath = path.join(clustersDir, fileName)
        await writeFile(
          filePath,
          renderClusterMarkdown(
            repo.owner,
            repo.name,
            cluster.id,
            summary,
            items,
          ),
        )
        logStep(
          `Finished cluster ${cluster.id}/${clusters.length} (${index + 1}/${clusters.length} scheduled)`,
        )
        return { cluster, summary, fileName }
      },
    )
  }

  await writeFile(
    path.join(runDir, 'index.md'),
    renderIndexMarkdown({
      repo: `${repo.owner}/${repo.name}`,
      user: options.user,
      contextLines: options.contextLines,
      embeddingModel: options.embeddingModel,
      summaryModel: options.summaryModel,
      similarityThreshold: options.similarityThreshold,
      runDir,
      filteredCount: filteredComments.length,
      commentCount: enrichedComments.length,
      clusterSummaries,
      since: options.since,
      prCreatedSince: options.prCreatedSince,
    }),
  )

  console.log(
    `Wrote ${enrichedComments.length} comments and ${clusterSummaries.length} cluster summaries to ${runDir}`,
  )
}

function parseCliArgs(): ScriptOptions {
  const parsed = parseArgs({
    options: {
      repo: { type: 'string' },
      user: { type: 'string' },
      'output-dir': { type: 'string', default: DEFAULT_OUTPUT_DIR },
      'context-lines': {
        type: 'string',
        default: String(DEFAULT_CONTEXT_LINES),
      },
      'embedding-model': { type: 'string', default: DEFAULT_EMBEDDING_MODEL },
      'summary-model': { type: 'string', default: DEFAULT_SUMMARY_MODEL },
      'similarity-threshold': {
        type: 'string',
        default: String(DEFAULT_SIMILARITY_THRESHOLD),
      },
      limit: { type: 'string' },
      since: { type: 'string' },
      'pr-created-since': { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
    allowPositionals: false,
    strict: true,
  })

  if (parsed.values.help) {
    printHelpAndExit()
  }

  const repo = parsed.values.repo
  const user = parsed.values.user
  if (!repo || !user) {
    printHelpAndExit('Missing required flags: --repo and --user.')
  }

  const contextLines = parsePositiveInteger(
    parsed.values['context-lines'],
    '--context-lines',
  )
  const similarityThreshold = parseFloatFlag(
    parsed.values['similarity-threshold'],
    '--similarity-threshold',
    0,
    1,
  )
  const limit = parsed.values.limit
    ? parsePositiveInteger(parsed.values.limit, '--limit')
    : null
  const since = parsed.values.since
    ? parseDateFlag(parsed.values.since, '--since')
    : null
  const prCreatedSince = parsed.values['pr-created-since']
    ? parseDateFlag(parsed.values['pr-created-since'], '--pr-created-since')
    : null

  return {
    repo,
    user: user.toLowerCase(),
    outputDir: parsed.values['output-dir'],
    contextLines,
    embeddingModel: parsed.values['embedding-model'],
    summaryModel: parsed.values['summary-model'],
    similarityThreshold,
    limit,
    since,
    prCreatedSince,
  }
}

function printHelpAndExit(message?: string): never {
  if (message) {
    console.error(message)
    console.error('')
  }

  console.log(`Usage:
  bun run styleguide-review/scripts/analyze_pr_reviews.ts --repo <owner/name> --user <github-login> [options]

Required:
  --repo <owner/name>              GitHub repository, for example openai/openai-node
  --user <github-login>            GitHub review author to analyze

Options:
  --output-dir <path>              Output base directory (default: ${DEFAULT_OUTPUT_DIR})
  --context-lines <n>              Lines of code before/after the discussed line (default: ${DEFAULT_CONTEXT_LINES})
  --embedding-model <model>        OpenAI embedding model (default: ${DEFAULT_EMBEDDING_MODEL})
  --summary-model <model>          OpenAI summarization model (default: ${DEFAULT_SUMMARY_MODEL})
  --similarity-threshold <0..1>    Auto-clustering threshold (default: ${DEFAULT_SIMILARITY_THRESHOLD})
  --limit <n>                      Max authored comments to process
  --since <ISO date>               Lower created-at bound, e.g. 2025-01-01
  --pr-created-since <ISO date>    Only include comments from PRs created on or after this date
  -h, --help                       Show this help

Environment:
  OPENAI_API_KEY                   Required for embeddings and cluster summaries
  gh                               Must be installed and authenticated locally
`)
  process.exit(message ? 1 : 0)
}

function parsePositiveInteger(value: string, flagName: string): number {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flagName} must be a positive integer.`)
  }
  return parsed
}

function parseFloatFlag(
  value: string,
  flagName: string,
  min: number,
  max: number,
): number {
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`${flagName} must be a number between ${min} and ${max}.`)
  }
  return parsed
}

function parseDateFlag(value: string, flagName: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${flagName} must be a valid date string.`)
  }
  return parsed.toISOString()
}

function ensureEnv(name: string): void {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
}

async function loadDotEnv(): Promise<void> {
  const envPath = path.join(import.meta.dir, '.env')
  try {
    const contents = await readFile(envPath, 'utf8')
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) {
        continue
      }

      const separator = line.indexOf('=')
      if (separator === -1) {
        continue
      }

      const key = line.slice(0, separator).trim()
      const value = stripMatchingQuotes(line.slice(separator + 1).trim())
      if (key && process.env[key] === undefined) {
        process.env[key] = value
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes('No such file')) {
      throw error
    }
  }
}

function stripMatchingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  return value
}

function ensureGhAvailable(): void {
  const version = Bun.spawnSync({
    cmd: ['gh', '--version'],
    stdout: 'pipe',
    stderr: 'pipe',
  })
  if (version.exitCode !== 0) {
    throw new Error('gh is not installed or is not on PATH.')
  }

  const auth = Bun.spawnSync({
    cmd: ['gh', 'auth', 'status'],
    stdout: 'pipe',
    stderr: 'pipe',
  })
  if (auth.exitCode !== 0) {
    throw new Error(
      'gh is installed but not authenticated. Run `gh auth login` first.',
    )
  }
}

function parseRepo(repo: string): { owner: string; name: string } {
  const match = /^([^/\s]+)\/([^/\s]+)$/.exec(repo.trim())
  if (!match) {
    throw new Error(`Invalid --repo value "${repo}". Expected owner/name.`)
  }
  return { owner: match[1], name: match[2] }
}

async function fetchReviewCommentsGraphQl(
  owner: string,
  repo: string,
  options: ScriptOptions,
): Promise<RawReviewComment[]> {
  const comments: RawReviewComment[] = []
  const pullRequests = await fetchCandidatePullRequests(
    owner,
    repo,
    options.prCreatedSince,
  )

  logStep(
    `Inspecting ${pullRequests.length} pull requests for authored review comments`,
  )

  for (const [index, pullRequest] of pullRequests.entries()) {
    logStep(
      `Scanning PR ${pullRequest.number} (${index + 1}/${pullRequests.length}, created ${pullRequest.createdAt})`,
    )
    const prComments = await fetchPullRequestReviewComments(
      owner,
      repo,
      pullRequest.number,
      pullRequest.createdAt,
      options.user,
    )
    comments.push(...prComments)
  }

  return comments
}

async function fetchCandidatePullRequests(
  owner: string,
  repo: string,
  prCreatedSince: string | null,
): Promise<PullRequestListingNode[]> {
  const query = `
    query($owner: String!, $name: String!, $after: String) {
      repository(owner: $owner, name: $name) {
        pullRequests(
          first: 50
          after: $after
          states: [OPEN, MERGED, CLOSED]
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            number
            createdAt
            url
            author {
              login
            }
          }
        }
      }
    }
  `

  const items: PullRequestListingNode[] = []
  const cutoff = prCreatedSince ? Date.parse(prCreatedSince) : null
  let after: string | null = null

  while (true) {
    logStep(
      `Requesting pull request page${after ? ' after cursor' : ' 1'} via GraphQL`,
    )
    const payload = await ghGraphQl<GraphQlPullRequestsResponse>(
      query,
      { owner, name: repo, after },
      'fetching pull request list',
    )

    const connection = payload.data?.repository?.pullRequests
    if (!connection) {
      throw new Error(`Unable to load pull requests for ${owner}/${repo}.`)
    }

    for (const node of connection.nodes) {
      if (cutoff && Date.parse(node.createdAt) < cutoff) {
        return items
      }
      items.push(node)
    }

    if (!connection.pageInfo.hasNextPage || !connection.pageInfo.endCursor) {
      return items
    }

    after = connection.pageInfo.endCursor
  }
}

async function fetchPullRequestReviewComments(
  owner: string,
  repo: string,
  prNumber: number,
  prCreatedAt: string,
  userLogin: string,
): Promise<RawReviewComment[]> {
  const query = `
    query($owner: String!, $name: String!, $number: Int!, $threadsAfter: String) {
      repository(owner: $owner, name: $name) {
        pullRequest(number: $number) {
          number
          createdAt
          url
          reviewThreads(first: 50, after: $threadsAfter) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              comments(first: 100) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  id
                  body
                  path
                  line
                  originalLine
                  startLine
                  originalStartLine
                  diffHunk
                  url
                  createdAt
                  updatedAt
                  author {
                    login
                  }
                  commit {
                    oid
                  }
                  originalCommit {
                    oid
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const comments: RawReviewComment[] = []
  let threadsAfter: string | null = null

  while (true) {
    const payload = await ghGraphQl<GraphQlReviewThreadsResponse>(
      query,
      { owner, name: repo, number: prNumber, threadsAfter },
      `fetching review threads for PR ${prNumber}`,
    )

    const pullRequest = payload.data?.repository?.pullRequest
    const threadConnection = pullRequest?.reviewThreads
    if (!pullRequest || !threadConnection) {
      return comments
    }

    for (const thread of threadConnection.nodes) {
      comments.push(
        ...collectMatchingComments(
          thread.comments.nodes,
          pullRequest.number,
          prCreatedAt,
          userLogin,
        ),
      )

      if (
        thread.comments.pageInfo.hasNextPage &&
        thread.comments.pageInfo.endCursor
      ) {
        comments.push(
          ...(await fetchRemainingThreadComments(
            thread.id,
            pullRequest.number,
            prCreatedAt,
            userLogin,
          )),
        )
      }
    }

    if (
      !threadConnection.pageInfo.hasNextPage ||
      !threadConnection.pageInfo.endCursor
    ) {
      return comments
    }

    threadsAfter = threadConnection.pageInfo.endCursor
  }
}

async function fetchRemainingThreadComments(
  threadId: string,
  prNumber: number,
  prCreatedAt: string,
  userLogin: string,
): Promise<RawReviewComment[]> {
  const query = `
    query($threadId: ID!, $after: String) {
      node(id: $threadId) {
        ... on PullRequestReviewThread {
          comments(first: 100, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              body
              path
              line
              originalLine
              startLine
              originalStartLine
              diffHunk
              url
              createdAt
              updatedAt
              author {
                login
              }
              commit {
                oid
              }
              originalCommit {
                oid
              }
            }
          }
        }
      }
    }
  `

  const comments: RawReviewComment[] = []
  let after: string | null = null

  while (true) {
    const payload = await ghGraphQl<GraphQlThreadCommentsResponse>(
      query,
      { threadId, after },
      `fetching additional thread comments for thread ${threadId}`,
    )

    const connection = payload.data?.node?.comments
    if (!connection) {
      return comments
    }

    comments.push(
      ...collectMatchingComments(
        connection.nodes,
        prNumber,
        prCreatedAt,
        userLogin,
      ),
    )

    if (!connection.pageInfo.hasNextPage || !connection.pageInfo.endCursor) {
      return comments
    }

    after = connection.pageInfo.endCursor
  }
}

function collectMatchingComments(
  nodes: GraphQlReviewCommentNode[],
  prNumber: number,
  prCreatedAt: string,
  userLogin: string,
): RawReviewComment[] {
  return nodes
    .filter((node) => node.author?.login?.toLowerCase() === userLogin)
    .map((node) => ({
      id: node.id,
      body: node.body,
      path: node.path,
      line: node.line,
      original_line: node.originalLine,
      start_line: node.startLine,
      original_start_line: node.originalStartLine,
      side: null,
      start_side: null,
      commit_id: node.commit?.oid ?? null,
      original_commit_id: node.originalCommit?.oid ?? null,
      diff_hunk: node.diffHunk,
      html_url: node.url,
      created_at: node.createdAt,
      updated_at: node.updatedAt,
      pr_number: prNumber,
      pr_created_at: prCreatedAt,
      user: node.author ? { login: node.author.login } : null,
    }))
}

function filterComments(
  comments: RawReviewComment[],
  options: ScriptOptions,
): RawReviewComment[] {
  const sinceMs = options.since ? Date.parse(options.since) : null

  const filtered = comments
    .filter((comment) => Boolean(comment.path))
    .filter((comment) => {
      if (!sinceMs) {
        return true
      }
      return Date.parse(comment.created_at) >= sinceMs
    })
    .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))

  if (options.limit) {
    logStep(
      `Keeping the most recent ${options.limit} matching comments after filtering`,
    )
    return filtered.slice(-options.limit)
  }

  return filtered
}

async function enrichComment(
  comment: RawReviewComment,
  owner: string,
  repo: string,
  contextLines: number,
  commentsDir: string,
): Promise<EnrichedComment> {
  const prNumber =
    comment.pr_number ??
    parsePrNumber(comment.pull_request_url ?? comment.html_url)
  const commentFileName = buildCommentFileName(
    comment.id,
    prNumber,
    comment.path,
  )
  const commentFilePath = path.join(commentsDir, commentFileName)
  const context = await resolveCommentContext(
    comment,
    owner,
    repo,
    contextLines,
  )
  const contextPreview =
    context.snippet ?? comment.diff_hunk ?? 'No code context available.'
  const embeddingInput = [
    `Repository file: ${comment.path}`,
    `Pull request: ${prNumber ?? 'unknown'}`,
    `Comment body: ${cleanInlineText(comment.body)}`,
    `Code context: ${cleanInlineText(contextPreview)}`,
  ].join('\n')

  return {
    id: comment.id,
    prNumber,
    filePath: comment.path,
    body: comment.body,
    htmlUrl: comment.html_url,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    commentFileName,
    commentFilePath,
    diffHunk: comment.diff_hunk ?? null,
    context,
    embeddingInput,
    contextPreview,
  }
}

async function resolveCommentContext(
  comment: RawReviewComment,
  owner: string,
  repo: string,
  contextLines: number,
): Promise<CommentContext> {
  const originalAttempt = {
    commitSha: comment.original_commit_id,
    startLine: comment.original_start_line ?? comment.original_line,
    endLine: comment.original_line,
  }
  const currentAttempt = {
    commitSha: comment.commit_id,
    startLine: comment.start_line ?? comment.line,
    endLine: comment.line,
  }

  for (const attempt of [originalAttempt, currentAttempt]) {
    if (!attempt.commitSha || !attempt.startLine) {
      continue
    }

    try {
      const fileContent = await fetchFileAtCommit(
        owner,
        repo,
        comment.path,
        attempt.commitSha,
      )
      const snippet = extractSnippet(
        fileContent,
        attempt.startLine,
        attempt.endLine ?? attempt.startLine,
        contextLines,
      )
      if (snippet) {
        return {
          commitSha: attempt.commitSha,
          startLine: attempt.startLine,
          endLine: attempt.endLine ?? attempt.startLine,
          codeFenceLabel: inferCodeFence(comment.path),
          snippet,
          degradedReason: null,
          source: 'file',
        }
      }
    } catch (error) {
      // Fallback handled below.
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('404')) {
        continue
      }
    }
  }

  return {
    commitSha: comment.original_commit_id ?? comment.commit_id,
    startLine:
      comment.original_start_line ??
      comment.start_line ??
      comment.original_line ??
      comment.line,
    endLine: comment.original_line ?? comment.line,
    codeFenceLabel: 'diff',
    snippet: comment.diff_hunk ?? null,
    degradedReason:
      'Fell back to the GitHub diff hunk because the source file or exact line could not be resolved at the review commit.',
    source: 'diff_hunk',
  }
}

async function fetchFileAtCommit(
  owner: string,
  repo: string,
  filePath: string,
  ref: string,
): Promise<string> {
  const encodedPath = encodeGitHubPath(filePath)
  const response = await ghApiJson<{ content?: string; encoding?: string }>(
    [
      '-H',
      'Accept: application/vnd.github+json',
      '-H',
      `X-GitHub-Api-Version: ${GITHUB_API_VERSION}`,
      `repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(ref)}`,
    ],
    `fetching ${filePath} at ${ref}`,
  )

  if (!response.content || response.encoding !== 'base64') {
    throw new Error(
      `Unexpected GitHub contents payload for ${filePath} at ${ref}.`,
    )
  }

  const normalizedBase64 = response.content.replace(/\s+/g, '')
  return Buffer.from(normalizedBase64, 'base64').toString('utf8')
}

function encodeGitHubPath(value: string): string {
  return value
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function extractSnippet(
  fileContent: string,
  startLine: number,
  endLine: number,
  contextLines: number,
): string | null {
  const lines = fileContent.split(/\r?\n/)
  if (lines.length === 0) {
    return null
  }

  const safeStart = clamp(startLine, 1, lines.length)
  const safeEnd = clamp(endLine, safeStart, lines.length)
  const from = clamp(safeStart - contextLines, 1, lines.length)
  const to = clamp(safeEnd + contextLines, 1, lines.length)
  const lineNumberWidth = String(to).length

  return lines
    .slice(from - 1, to)
    .map((line, index) => {
      const lineNumber = from + index
      const marker =
        lineNumber >= safeStart && lineNumber <= safeEnd ? '>' : '|'
      return `${String(lineNumber).padStart(lineNumberWidth, ' ')} ${marker} ${line}`
    })
    .join('\n')
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function inferCodeFence(filePath: string): string {
  const extension = path.extname(filePath).replace(/^\./, '')
  return extension || 'text'
}

function buildCommentFileName(
  commentId: string,
  prNumber: number | null,
  filePath: string,
): string {
  const base =
    slugify(path.basename(filePath, path.extname(filePath))) || 'comment'
  const prPart = prNumber ? `pr-${prNumber}` : 'pr-unknown'
  return `${prPart}-comment-${slugify(commentId) || 'comment'}-${base}.md`
}

function buildClusterFileName(clusterId: number, title: string): string {
  const slug = slugify(title) || `cluster-${clusterId}`
  return `cluster-${String(clusterId).padStart(3, '0')}-${slug}.md`
}

function parsePrNumber(value: string): number | null {
  const match =
    /\/pulls?\/(\d+)$/.exec(value) ?? /\/pull\/(\d+)(?:\/|$)/.exec(value)
  if (!match) {
    return null
  }
  return Number.parseInt(match[1], 10)
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

async function createEmbeddings(
  input: string[],
  model: string,
): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY
  const batchSize = 50
  const batches: Array<{ start: number; items: string[] }> = []

  for (let index = 0; index < input.length; index += batchSize) {
    batches.push({ start: index, items: input.slice(index, index + batchSize) })
  }

  const batchResults = await mapWithConcurrency(
    batches,
    OPENAI_REQUEST_CONCURRENCY,
    async (batch, batchIndex) => {
      logStep(`Embedding batch ${batchIndex + 1}/${batches.length}`)
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          input: batch.items,
          encoding_format: 'float',
        }),
      })

      if (!response.ok) {
        throw new Error(
          `OpenAI embeddings request failed with ${response.status}: ${await response.text()}`,
        )
      }

      const payload = (await response.json()) as {
        data: Array<{ index: number; embedding: number[] }>
      }

      const embeddings = [...payload.data]
        .sort((a, b) => a.index - b.index)
        .map((item) => normalizeVector(item.embedding))
      logStep(`Finished embedding batch ${batchIndex + 1}/${batches.length}`)
      return { start: batch.start, embeddings }
    },
  )

  return batchResults
    .sort((left, right) => left.start - right.start)
    .flatMap((batch) => batch.embeddings)
}

function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(
    vector.reduce((sum, value) => sum + value * value, 0),
  )
  if (magnitude === 0) {
    return vector.map(() => 0)
  }
  return vector.map((value) => value / magnitude)
}

function clusterEmbeddings(
  embeddings: number[][],
  threshold: number,
): Cluster[] {
  const clusters: Cluster[] = []

  embeddings.forEach((embedding, itemIndex) => {
    let bestCluster: Cluster | null = null
    let bestScore = Number.NEGATIVE_INFINITY

    for (const cluster of clusters) {
      const score = dotProduct(embedding, cluster.centroid)
      if (score > bestScore) {
        bestScore = score
        bestCluster = cluster
      }
    }

    if (!bestCluster || bestScore < threshold) {
      clusters.push({
        id: clusters.length + 1,
        itemIndexes: [itemIndex],
        sum: [...embedding],
        centroid: [...embedding],
      })
      return
    }

    bestCluster.itemIndexes.push(itemIndex)
    bestCluster.sum = addVectors(bestCluster.sum, embedding)
    bestCluster.centroid = normalizeVector(bestCluster.sum)
  })

  return clusters
    .sort((a, b) => b.itemIndexes.length - a.itemIndexes.length || a.id - b.id)
    .map((cluster, index) => ({
      ...cluster,
      id: index + 1,
    }))
}

function dotProduct(left: number[], right: number[]): number {
  let sum = 0
  for (let index = 0; index < left.length; index += 1) {
    sum += left[index] * right[index]
  }
  return sum
}

function addVectors(left: number[], right: number[]): number[] {
  const result = new Array<number>(left.length)
  for (let index = 0; index < left.length; index += 1) {
    result[index] = left[index] + right[index]
  }
  return result
}

async function mapWithConcurrency<TInput, TOutput>(
  items: TInput[],
  concurrency: number,
  worker: (item: TInput, index: number) => Promise<TOutput>,
): Promise<TOutput[]> {
  if (items.length === 0) {
    return []
  }

  const results = new Array<TOutput>(items.length)
  let nextIndex = 0

  async function runWorker(): Promise<void> {
    while (true) {
      const currentIndex = nextIndex
      nextIndex += 1
      if (currentIndex >= items.length) {
        return
      }
      results[currentIndex] = await worker(items[currentIndex], currentIndex)
    }
  }

  const workerCount = Math.min(concurrency, items.length)
  await Promise.all(Array.from({ length: workerCount }, () => runWorker()))
  return results
}

async function summarizeCluster(
  comments: EnrichedComment[],
  owner: string,
  repo: string,
  model: string,
): Promise<ClusterSummary> {
  const apiKey = process.env.OPENAI_API_KEY
  const prompt = buildClusterPrompt(comments, owner, repo)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You summarize GitHub PR review comment clusters into concise styleguide themes. Return JSON only with keys title, summary, and principle.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(
      `OpenAI summary request failed with ${response.status}: ${await response.text()}`,
    )
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>
  }
  const rawContent = payload.choices?.[0]?.message?.content ?? ''
  const parsed = extractJsonObject(rawContent)

  if (
    parsed &&
    typeof parsed.title === 'string' &&
    typeof parsed.summary === 'string'
  ) {
    return {
      title: parsed.title.trim() || `Cluster of ${comments.length} comments`,
      summary: parsed.summary.trim(),
      principle:
        typeof parsed.principle === 'string' && parsed.principle.trim()
          ? parsed.principle.trim()
          : 'Keep the same review theme in mind when reviewing similar code.',
    }
  }

  return {
    title: `Cluster of ${comments.length} comments`,
    summary:
      rawContent.trim() ||
      'Unable to extract a structured summary from the model response.',
    principle:
      'Review comments in this cluster point to a recurring style concern.',
  }
}

function buildClusterPrompt(
  comments: EnrichedComment[],
  owner: string,
  repo: string,
): string {
  const examples = comments
    .slice(0, 12)
    .map((comment, index) => {
      const shortBody = truncate(cleanInlineText(comment.body), 400)
      const shortContext = truncate(
        cleanInlineText(comment.contextPreview),
        500,
      )
      return [
        `Example ${index + 1}:`,
        `- PR: ${comment.prNumber ?? 'unknown'}`,
        `- File: ${comment.filePath}`,
        `- Comment URL: ${comment.htmlUrl}`,
        `- Comment: ${shortBody}`,
        `- Code context: ${shortContext}`,
      ].join('\n')
    })
    .join('\n\n')

  return [
    `Repository: ${owner}/${repo}`,
    `Cluster size: ${comments.length}`,
    '',
    'Summarize the recurring theme across these review comments.',
    'Focus on what the reviewer is repeatedly pointing out, not on the individual PRs.',
    'Return JSON only in this shape:',
    '{"title":"short title","summary":"2-4 sentences","principle":"one actionable review principle"}',
    '',
    examples,
  ].join('\n')
}

function extractJsonObject(value: string): Record<string, unknown> | null {
  const start = value.indexOf('{')
  const end = value.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    return null
  }

  try {
    return JSON.parse(value.slice(start, end + 1)) as Record<string, unknown>
  } catch {
    return null
  }
}

function renderCommentMarkdown(
  owner: string,
  repo: string,
  comment: EnrichedComment,
): string {
  const metadata = [
    `# Review Comment ${comment.id}`,
    '',
    `- Repository: \`${owner}/${repo}\``,
    `- PR: ${comment.prNumber ?? 'unknown'}`,
    `- File: \`${comment.filePath}\``,
    `- Created: ${comment.createdAt}`,
    `- Updated: ${comment.updatedAt}`,
    `- Comment URL: ${comment.htmlUrl}`,
    comment.context.commitSha
      ? `- Commit: \`${comment.context.commitSha}\``
      : null,
    comment.context.startLine
      ? `- Discussed lines: ${formatLineRange(comment.context.startLine, comment.context.endLine)}`
      : null,
    `- Context source: \`${comment.context.source}\``,
    '',
    '## Comment',
    '',
    comment.body.trim() || '_Empty review comment_',
    '',
    '## Code Context',
    '',
  ]
    .filter(Boolean)
    .join('\n')

  const contextBlock = comment.context.snippet
    ? [
        `\`\`\`${comment.context.codeFenceLabel}`,
        comment.context.snippet,
        '```',
        '',
      ].join('\n')
    : '_No code context available._\n\n'

  const degraded = comment.context.degradedReason
    ? `> ${comment.context.degradedReason}\n\n`
    : ''

  const diffHunk =
    comment.diffHunk && comment.context.source !== 'diff_hunk'
      ? ['## Diff Hunk', '', '```diff', comment.diffHunk, '```', ''].join('\n')
      : ''

  return `${metadata}\n${degraded}${contextBlock}${diffHunk}`.trimEnd() + '\n'
}

function renderClusterMarkdown(
  owner: string,
  repo: string,
  clusterId: number,
  summary: ClusterSummary,
  comments: EnrichedComment[],
): string {
  const links = comments
    .map((comment) => {
      const label = `PR ${comment.prNumber ?? 'unknown'} · ${comment.filePath} · comment ${comment.id}`
      return `- [${label}](../comments/${comment.commentFileName})`
    })
    .join('\n')

  return [
    `# Cluster ${String(clusterId).padStart(3, '0')}: ${summary.title}`,
    '',
    `- Repository: \`${owner}/${repo}\``,
    `- Comments in cluster: ${comments.length}`,
    '',
    '## Summary',
    '',
    summary.summary.trim(),
    '',
    '## Review Principle',
    '',
    summary.principle.trim(),
    '',
    '## Source Comments',
    '',
    links,
    '',
  ].join('\n')
}

function renderIndexMarkdown(input: {
  repo: string
  user: string
  contextLines: number
  embeddingModel: string
  summaryModel: string
  similarityThreshold: number
  runDir: string
  filteredCount: number
  commentCount: number
  clusterSummaries: Array<{
    cluster: Cluster
    summary: ClusterSummary
    fileName: string
  }>
  since: string | null
  prCreatedSince: string | null
}): string {
  const clusterLinks =
    input.clusterSummaries.length === 0
      ? '_No clusters generated._'
      : input.clusterSummaries
          .map(
            ({ cluster, summary, fileName }) =>
              `- [Cluster ${String(cluster.id).padStart(3, '0')}: ${summary.title}](./clusters/${fileName}) (${cluster.itemIndexes.length} comments)`,
          )
          .join('\n')

  return [
    `# Review Analysis for ${input.user}`,
    '',
    `- Repository: \`${input.repo}\``,
    `- Since: ${input.since ?? 'all available review comments'}`,
    `- PR created since: ${input.prCreatedSince ?? 'all available pull requests'}`,
    `- Context lines: ${input.contextLines}`,
    `- Embedding model: \`${input.embeddingModel}\``,
    `- Summary model: \`${input.summaryModel}\``,
    `- Similarity threshold: ${input.similarityThreshold}`,
    `- Matching authored comments: ${input.filteredCount}`,
    `- Analyzed comments written to disk: ${input.commentCount}`,
    `- Output directory: \`${input.runDir}\``,
    '',
    '## Clusters',
    '',
    clusterLinks,
    '',
  ].join('\n')
}

function logStep(message: string): void {
  console.log(`[styleguide-review] ${message}`)
}

function formatLineRange(startLine: number, endLine: number | null): string {
  if (!endLine || endLine === startLine) {
    return String(startLine)
  }
  return `${startLine}-${endLine}`
}

function cleanInlineText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value
  }
  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

function buildTimestamp(): string {
  const now = new Date()
  const parts = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
    '-',
    String(now.getUTCHours()).padStart(2, '0'),
    String(now.getUTCMinutes()).padStart(2, '0'),
    String(now.getUTCSeconds()).padStart(2, '0'),
    'Z',
  ]
  return parts.join('')
}

async function ghApiJson<T>(args: string[], description: string): Promise<T> {
  const process = Bun.spawnSync({
    cmd: ['gh', 'api', ...args],
    stdout: 'pipe',
    stderr: 'pipe',
  })

  const stdout = Buffer.from(process.stdout).toString('utf8')
  const stderr = Buffer.from(process.stderr).toString('utf8').trim()

  if (process.exitCode !== 0) {
    throw new Error(
      `gh api failed while ${description}: ${stderr || stdout || `exit code ${process.exitCode}`}`,
    )
  }

  try {
    return JSON.parse(stdout) as T
  } catch (error) {
    throw new Error(
      `Unable to parse gh api JSON while ${description}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

async function ghGraphQl<T>(
  query: string,
  variables: Record<string, string | number | null>,
  description: string,
): Promise<T> {
  const args = ['graphql', '-f', `query=${query}`]
  for (const [key, value] of Object.entries(variables)) {
    if (value === null) {
      continue
    }
    args.push('-F', `${key}=${value}`)
  }

  const process = Bun.spawnSync({
    cmd: ['gh', 'api', ...args],
    stdout: 'pipe',
    stderr: 'pipe',
  })

  const stdout = Buffer.from(process.stdout).toString('utf8')
  const stderr = Buffer.from(process.stderr).toString('utf8').trim()

  if (process.exitCode !== 0) {
    throw new Error(
      `gh graphql failed while ${description}: ${stderr || stdout || `exit code ${process.exitCode}`}`,
    )
  }

  let parsed: { errors?: Array<{ message: string }> }
  try {
    parsed = JSON.parse(stdout) as { errors?: Array<{ message: string }> }
  } catch (error) {
    throw new Error(
      `Unable to parse gh graphql JSON while ${description}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  if (parsed.errors?.length) {
    throw new Error(
      `GitHub GraphQL returned errors while ${description}: ${parsed.errors.map((error) => error.message).join('; ')}`,
    )
  }

  return parsed as T
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
})
