### Docker

#### Dockerfile

There are two variants of Dockerfile used for both backend and frontend:

1. Production (`Dockerfile`)
   - Installs only packages required in production (no devDependencies)
   - Copies only required files to the image
   - Tries to be minimal so the image would be fast and small
2. Development (`dev.Dockerfile`)
   - Installs all packages from `package.json`
   - Copies all files from `backend` to the image (not counting `.dockerignore`d files)
   - Has multiple stages (dev and api-tests)
     - Learn more about multi-stage Dockerfiles: https://docs.docker.com/build/building/multi-stage/
   - Includes everything that is required / helps with development and testing

#### Docker compose

There are three variants of docker compose used in this project.

1. Production (`docker-compose.yml`)
   - Uses `{backend,frontend}/Dockerfile` for both backend and frontend
   - Uses `.env` for environment variables
   - Uses `data` for database initialization
   - Doesn't start phpMyAdmin
   - Can be started with `npm run start`
2. Dev (`docker-compose.dev.yml`)
   - Uses `{backend,frontend}/dev.Dockerfile`
   - Uses `.dev.env`
   - Uses `data` for database initialization
   - Can be started with `npm run dev`
3. Anon (`docker-compose.anon.yml`)
   - Uses `{backend,frontend}/dev.Dockerfile`
   - Uses `.anon.env`
   - Uses `test_data` for database initialization
   - Can be started with `npm run start:anon`
