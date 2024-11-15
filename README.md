# Nowdatabase

**NOW - New and Old Worlds - Database of fossil mammals**

Rebuild of a fossil database application, old version at https://nowdatabase.luomus.fi/

The new version is not deployed yet.

---

### Developer documentation

**Basic commands** :computer:

- `npm run setup`
  - Installs all node modules, and generates prisma client
- `npm run dev`
  - Uses `docker-compose.dev.yml`
  - Run in development mode: with hot reload
  - To create test users visit `http://localhost:4000/test/create-test-users`

Testing:

- `npm run check`
  - Runs `tsc` and `eslint` for frontend and backend: Use this to check for errors before committing.
- `npm run test:api`
  - Runs the api-tests in a docker container
  - Requires database to be running. Can be achieved by `npm run start:anon -- db-anon` or just `npm run start:anon:api`.
  - Uses `test_data`
  - Uses `.test.env`
  - `npm run test:api:build` builds the container used to run the tests.
  - `npm run test:api:run` runs the previously built container.
- `npm run test:e2e`
  - Runs e2e-tests inside a docker container.
  - Requires `frontend`, `backend` and `database` to be running. Can be achieved by running `npm run start:anon`.
  - Uses `test_data`
- `npm run test:e2e:local`
  - Runs cypress-tests locally (not in docker) in headless mode.
  - Requires `npm run start:anon` to be running first.
- `npm run test:api:local`
  - Runs backend api tests locally (not in docker).
  - Requires `db-anon` to be running first. (Note: backend doesn't need to be running.)
  - Requires `.test.env`
- `npm run cypress`
  - Opens cypress GUI. You can run tests and see what they do.

Windows testing:

- Both `e2e` and `api-tests` have a Windows specific command.
  - `e2e` is `npm run test:e2e:windows`
  - `api-tests` is `npm run test:api:windows`
  - For `api-tests`: inside `.test.env`, you need to change all instances of `localhost` to `host.docker.internal`.
    - These include `MARIADB_HOST`, `DATABASE_URL` and `LOG_DATABASE_URL`.
  - Note: these are not tested yet.

Test env-file:

- `.test.env`
  - `api-tests` requires `.test.env` to set the correct environment variables.
  - This is created by copying `.anon.env` and changing all instances of `nowdb-db-anon` to `localhost`.
    - These include `MARIADB_HOST`, `DATABASE_URL` and `LOG_DATABASE_URL`.

Coverage:

- Coverage opening
  - Coverage can be opened by opening the `coverage/lcov-report/index.html` with your browser of choice.
- `coverage:sed`
  - Fixes issues with `.nyc_output` paths. Replaces the paths inside Docker to `$PWD` (current directory).
- `coverage`
  - First fixes paths with `coverage:sed` and then recreates `coverage/lcov-report` to match the new path.
- `coverage:report`
  - Alias to `npm run coverage`. Used by cypress e2e tests so that `coverage:sed` gets executed automatically.

Run with the same image that is used in production:

- `npm start`
  - Uses `docker-compose.yml`
  - This builds the code and runs it. Mostly you'll want to use this after major technical changes to check the code works also in production mode, before deploying. And then you'll likely want to do: `npm start -- --build` to force rebuild of containers.

Docker:

- `npm run dev:down`
  - Stops and removes the dev container and it's volumes.
- `-- --build`
  - Useful flag to force docker to rebuild the containers. Example usage for dev: `npm run dev -- --build`

**Further documentation**

:rocket: [Initialize app & restore db](documentation/init.md) How to get the app up & running, and initialize database from sql-dumps

:wrench: [Technical explanations](documentation/guides/technical_explanations.md) Explanations of how things work, and guides for some more rare tasks like updating database-schema

:raised_hands: [Contributing & integration flow](documentation/guides/contributing.md) Where to commit? Where are tests run? How is the code deployed?

:memo: [Frontend](documentation/components/frontend.md) Explanation of the frontend logic and how to add views

:mag_right: [Validators](frontend/src/validators/) The [readme](frontend/src/validators/README.md) explains how validators are written

:mag_right: [Class diagram](documentation/class_diagram.md) See the relations of relevant tables. Notice that it omits some unimportant tables and does not show most columns.

:earth_africa: [Map features](/documentation/components/map_features.md) Maps' functionality and development notes
