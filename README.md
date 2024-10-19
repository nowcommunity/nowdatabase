# Nowdatabase

**NOW - New and Old Worlds - Database of fossil mammals**

Rebuild of a fossil database application, old version at https://nowdatabase.luomus.fi/ 

The new version is not deployed yet.

_____

### Developer documentation

**Basic commands** :computer:

+ `npm run setup`
  + Installs all node modules, and generates prisma client
+ `npm run dev` 
  + Uses `docker-compose.dev.yml`
  + Run in development mode: with hot reload
  + To create test users visit `http://localhost:4000/test/create-test-users`

Testing:

+ `npm run check`
  + Runs `tsc` and `eslint` for frontend and backend: Use this to check for errors before committing.
+ `npm run test:api`
  + Runs all required containers and api-tests with one command inside Docker. 
  + Uses `docker-compose.test.yml`
  + Uses `test_data`
+ `npm run test:e2e`
  + Runs all required containers and e2e-tests with one command inside Docker. 
  + Uses `docker-compose.test.yml`
  + Uses `test_data`
+ `npm run test:up`
  + Runs the test version of the project with anonymized test-database without tests.
  + Uses `docker-compose.test.yml`
  + Uses `test_data`
+ `npm run test:local:e2e`
  + Runs cypress-tests locally in headless mode. Requires `npm run test:up` to be running first.
+ `npm run test:local:api`
  + Runs backend api tests. Requires `db-anon` to be running first. (Note: backend doesn't need to be running.)
  + All environment variables need to be set.
+ `npm run cypress`
  + Opens cypress. You can run tests and see what they do.

Coverage:

+ Coverage opening
  + Coverage can be opened by opening the `coverage/lcov-report/index.html` with your browser of choice.
+ `coverage:sed`
  + Fixes issues with `.nyc_output` paths. Replaces the paths inside Docker to `$PWD` (current directory).
+ `coverage`
  + First fixes paths with `coverage:sed` and then recreates `coverage/lcov-report` to match the new path.
+ `coverage:report`
  + Alias to `npm run coverage`. Used by cypress e2e tests so that `coverage:sed` gets executed automatically.

Run with the same image that is used in production:

+ `npm start`
  + Uses `docker-compose.yml`
  + This builds the code and runs it. Mostly you'll want to use this after major technical changes to check the code works also in production mode, before deploying. And then you'll likely want to do: `npm start -- --build` to force rebuild of containers.

Docker:

+ `npm run dev:down`
  + Stops and removes the dev container.
+ `-- --build`
  + Useful flag to force docker to rebuild the containers. Example usage for dev: `npm run dev -- --build`

**Further documentation**

:rocket: [Initialize app & restore db](documentation/init.md) How to get the app up & running, and initialize database from sql-dumps

:wrench: [Technical explanations](documentation/technical_explanations.md) Explanations of how things work, and guides for some more rare tasks like updating database-schema

:raised_hands: [Contributing & integration flow](documentation/contributing.md) Where to commit? Where are tests run? How is the code deployed?

:memo: [Frontend](documentation/frontend.md) Explanation of the frontend logic and how to add views

:mag_right: [Validators](frontend/src/validators/) The readme explains how validators are written

:mag_right: [Class diagram](documentation/class_diagram.md) See the relations of relevant tables. Notice that it omits some unimportant tables and does not show most columns.

:earth_africa: [Map feature](/documentation/map_feat.md) Map's functionality and development notes
