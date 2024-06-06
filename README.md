# Nowdatabase

**NOW - New and Old Worlds - Database of fossil mammals**

Rebuild of a fossil database application, old version at https://nowdatabase.luomus.fi/ 

The new version is not deployed yet.

_____

### Developer documentation

**Basic commands** :computer:

+ `npm run dev` 
  + Uses `docker-compose.dev.yml`
  + Run in development mode: with hot reload
+ `npm run check`
  + Runs `tsc` and `eslint` for frontend and backend: Use this to check for errors before committing, if you feel like it.
+ `npm run start:anon`
  + Uses `docker-compose.anon.yml`
  + Runs the app with anonymized test-database. Make cypress-tests using this version
+ `npm test`
  + Runs cypress-tests in headless mode, same as in GitHub Actions. Requires the above command to be ran first.
+ `npm run cypress`
  + Opens cypress. You can run tests and see what they do.
+ `npm start`
  + Uses `docker-compose.yml`
  + This builds the code and runs it. Mostly you'll want to use this after major technical changes to check the code works also in production mode, before deploying. And then you'll likely want to do: `npm start -- --build` to force rebuild of containers.

**Further documentation**

:open_file_folder: [Documentation](documentation)-directory has documentation for developers. Remember to update it if you modify something important like project architecture.

:rocket: [Initialize app & restore db](documentation/init.md) How to get the app up & running, and initialize database from sql-dumps

:wrench: [Technical explanations](documentation/technical_explanations.md) Explanations of how things work, and guides for some more rare tasks like generating sequelize models.

:raised_hands: [Contributing & integration flow](documentation/contributing.md) Where to commit? Where are tests run? How is the code deployed?

:nut_and_bolt: [Typing the API](documentation/typing.md) How to bring types from backend to frontend

:memo: [Frontend](documentation/frontend.md) Explanation of the frontend logic and how to add views

:mag_right: [Validators](frontend/src/validators/) The readme explains how validators are written

:mag_right: [Class diagram](documentation/class_diagram.md) See the relations of relevant tables. Notice that it omits some unimportant tables and does not show most columns.
