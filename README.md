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

Testing:

+ `npm run check`
  + Runs `tsc` and `eslint` for frontend and backend: Use this to check for errors before committing, if you feel like it.
+ `npm run start:anon`
  + Uses `docker-compose.anon.yml`
  + Runs the app with anonymized test-database. Make cypress-tests using this version
+ `npm run test:e2e`
  + Runs cypress-tests in headless mode, same as in GitHub Actions. Requires `npm run start:anon` to be ran first.
+ `npm run test:api`
  + Runs backend api tests. Requires `npm run start:anon` to be ran first.
+ `npm run cypress`
  + Opens cypress. You can run tests and see what they do.

Run with the same image that is used in production:

+ `npm start`
  + Uses `docker-compose.yml`
  + This builds the code and runs it. Mostly you'll want to use this after major technical changes to check the code works also in production mode, before deploying. And then you'll likely want to do: `npm start -- --build` to force rebuild of containers.

**Further documentation**

:rocket: [Initialize app & restore db](documentation/init.md) How to get the app up & running, and initialize database from sql-dumps

:wrench: [Technical explanations](documentation/technical_explanations.md) Explanations of how things work, and guides for some more rare tasks like updating database-schema

:raised_hands: [Contributing & integration flow](documentation/contributing.md) Where to commit? Where are tests run? How is the code deployed?

:memo: [Frontend](documentation/frontend.md) Explanation of the frontend logic and how to add views

:mag_right: [Validators](frontend/src/validators/) The readme explains how validators are written

:mag_right: [Class diagram](documentation/class_diagram.md) See the relations of relevant tables. Notice that it omits some unimportant tables and does not show most columns.
