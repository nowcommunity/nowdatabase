# In-app Changelog (GitHub Releases)

The application front page shows a **Changelog** section that is sourced from **GitHub releases** in the
`nowcommunity/nowdatabase` repository.

## Overview

- Backend route: `GET /changelog`
- Frontend: `frontend/src/components/FrontPage.tsx` fetches the route via RTK Query and renders the entries.
- Purpose: show what has been deployed (release title + description + release creation time).

## Backend

### Route

- `backend/src/routes/changelog.ts` exposes `GET /changelog`
- `backend/src/services/changelog.ts` fetches GitHub releases from the GitHub REST API.

### Caching and failure behavior

- The backend keeps an in-memory cache with a TTL (see `CACHE_TTL_MS` in `backend/src/services/changelog.ts`).
- If GitHub fetching fails and there is a cached value, the cached value is returned.

### Authentication / rate limits

- The service will use `process.env.GITHUB_TOKEN` (or `process.env.GH_TOKEN`) if present.
- If no token is provided, unauthenticated GitHub API requests are used and may hit stricter rate limits.

## Frontend

- Query is defined in `frontend/src/redux/changelogReducer.ts` and hits `/changelog`.
- The front page renders `bodyHtml` using `dangerouslySetInnerHTML`.
  - The HTML comes from GitHub’s `application/vnd.github.v3.html+json` response format.
  - GitHub’s rendered HTML is expected to be sanitized by GitHub; we do not add extra client-side sanitization.

## Filtering “internal” notes

The changelog supports a simple mechanism to hide internal-only notes:

- A release is omitted entirely if its **title** starts with `Internal:`
- Within a release description, anything after a heading `### Internal` is omitted.

## How to publish a changelog entry

1. Create a GitHub release in `nowcommunity/nowdatabase`.
2. Write user-facing notes in the release title/body.
3. Optionally include internal-only notes:
   - Prefix the release title with `Internal:` to hide the whole release, or
   - Add a `### Internal` section at the end of the release body to hide only that section.

