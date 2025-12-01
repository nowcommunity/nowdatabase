# Write access guard

Global write access is controlled by two environment variables that apply to all edit and delete requests (as well as creates and updates) across the API.

## Environment variables
- `RUNNING_ENV` (`VITE_RUNNING_ENV` in `.env`): Defaults to `prod` when unset. Accepted values: `dev`, `staging`, `prod`.
- `VITE_ENABLE_WRITE`: When set to `true`, write operations are permitted even outside `dev`.

Both variables are parsed in the backend configuration (`backend/src/utils/config.ts`). The Express app installs the `blockWriteRequests` middleware whenever `RUNNING_ENV` is not `dev` **and** `VITE_ENABLE_WRITE` is not `true`. In that mode, any write method (`POST`, `PUT`, `PATCH`, `DELETE`) that is not explicitly whitelisted is short-circuited with HTTP 403. This affects project deletion and any other editing endpoints.

## Typical configurations
- **Local development**: Use `RUNNING_ENV=dev` (default when running via Docker compose) to bypass the write guard entirely.
- **Staging/production**: With `RUNNING_ENV` set to `staging` or `prod`, set `VITE_ENABLE_WRITE=true` to allow edits and deletions. If omitted, the write guard blocks modifications even for admin users.

## How to enable edits/deletes
1. Confirm the container or process has `VITE_ENABLE_WRITE=true` in its environment (or set it in `.env`).
2. Restart the backend so the updated environment variables are loaded.
3. Retry the write action (e.g., deleting a project via `DELETE /project/:id`).

If writes remain blocked, inspect request logs for 403 responses; these indicate the write guard is still active.
