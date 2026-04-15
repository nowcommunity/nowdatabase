export type ChangelogEntry = {
  name: string
  tagName: string
  createdAt: string
  url: string
  bodyHtml: string
}

type GithubRelease = {
  name: string | null
  tag_name: string
  created_at: string
  html_url: string
  body_html: string
}

const CACHE_TTL_MS = 15 * 60 * 1000

let cached: { value: ChangelogEntry[]; fetchedAt: number } | null = null

const getGithubAuthHeader = () => {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN
  return token ? `Bearer ${token}` : null
}

const stripInternalSection = (bodyHtml: string) => {
  const internalHeading = /<h3>\s*Internal\s*<\/h3>/i
  const index = bodyHtml.search(internalHeading)
  if (index === -1) return bodyHtml
  return bodyHtml.slice(0, index)
}

const isInternalRelease = (name: string) => name.trim().toLowerCase().startsWith('internal:')

export const getChangelog = async (): Promise<ChangelogEntry[]> => {
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached.value

  const authHeader = getGithubAuthHeader()
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3.html+json',
    'User-Agent': 'nowdatabase-backend',
  }
  if (authHeader) headers.Authorization = authHeader

  const response = await fetch('https://api.github.com/repos/nowcommunity/nowdatabase/releases?per_page=10', {
    headers,
  })

  if (!response.ok) {
    if (cached) return cached.value
    throw new Error(`Failed to fetch releases: ${response.status}`)
  }

  const releases = (await response.json()) as GithubRelease[]

  const entries = releases
    .filter(release => typeof release.name === 'string' && release.name.trim().length > 0)
    .filter(release => !isInternalRelease(release.name!))
    .map(release => ({
      name: release.name!,
      tagName: release.tag_name,
      createdAt: release.created_at,
      url: release.html_url,
      bodyHtml: stripInternalSection(release.body_html ?? ''),
    }))

  cached = { value: entries, fetchedAt: Date.now() }
  return entries
}
