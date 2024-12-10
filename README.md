# Nowdatabase

**NOW - New and Old Worlds - Database of fossil mammals**

Rebuild of a fossil database application, old version at https://nowdatabase.luomus.fi/

The new version is not deployed yet.

---

### Developer documentation

**Basic commands** :computer:

- `npm run setup`
  - Creates all files and directories required to run the project
- `npm run dev`
  - Runs the application in development mode
  - Supports hot reloading
  - Serves frontend by default at `http://localhost:5173`
- `npm run test:api`
  - Runs api-tests inside Docker
  - Requires database to be running (start one with correct data: `npm run start:anon:api`)
- `npm run test:e2e`
  - Runs api-tests inside Docker
  - Requires frontend, backend and database to be running (start all with `npm run start:anon`)

**Further documentation**

:rocket: [Setup app & restore db](documentation/devops/setup.md) How to get the app up & running, and initialize database from sql-dumps

:keyboard: [List of all commands](documentation/devops/commands.md) A comprehensive list of all of the most important commands

:wrench: [Technical explanations](documentation/devops/technical_explanations.md) Explanations of how things work, and guides for some more rare tasks like updating database-schema

:raised_hands: [Contributing & integration flow](documentation/contributing.md) Where to commit? Where are tests run? How is the code deployed?

:memo: [Frontend](documentation/frontend/components/frontend.md) Explanation of the frontend logic and how to add views

:mag_right: [Validators](frontend/src/shared/validators/) The [readme](frontend/src/shared/validators/README.md) explains how validators are written

:mag_right: [Class diagram](documentation/class_diagram.md) See the relations of relevant tables. Notice that it omits some unimportant tables and does not show most columns.

:earth_africa: [Map features](documentation/frontend/components/map_features.md) Maps' functionality and development notes
