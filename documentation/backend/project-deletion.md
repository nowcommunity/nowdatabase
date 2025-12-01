# Project deletion behavior

## Endpoint overview
- **Route:** `DELETE /project/:id`
- **Permissions:** Restricted to Admin users.
- **Behavior:** Deletes the project transactionally, removing project-member links before deleting the project record.

## Global write guard interaction
- A global middleware `blockWriteRequests` blocks all write methods (POST/PUT/PATCH/DELETE) unless explicitly allowed.
- The middleware is enabled whenever `RUNNING_ENV` is not `dev` **and** `VITE_ENABLE_WRITE` is not set to `true`.
- In that mode, attempts to call `DELETE /project/:id` return **403 Forbidden**, even for Admins and for existing projects. The frontend surfaces this as the "Could not delete project." error.

## Enabling deletion
- For non-`dev` environments, set `VITE_ENABLE_WRITE=true` to permit deletions.
- For local development, use `RUNNING_ENV=dev` (default) to bypass the write guard entirely.
