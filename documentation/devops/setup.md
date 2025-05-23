### Initializing the application

**Setup DB restore** :cd:

1. Make an empty directory `sqlfiles` inside `data` folder which is in the repository root.
2. Place the database dump files `now_test.sql`, `now_log_test.sql` and `now_view.sql` inside it.
3. Notice, that the container will have to be able to read these files and execute `data/restore_and_create_user.sql`, so you may have to adjust the necessary rights depending on your operating system.

See [database docs](./database.md) for how this works.

**Init the project** :rocket:

Requirements: npm and some modern installation of Docker engine with Docker compose.

1. `npm run setup` in project root to install all node modules, generate prisma-client and create all required config files (doesn't overwrite previous ones!).
2. If you wish to use the staging database, you need to copy the dump files into `data/sqlfiles/` directory. See example of how anonymized test data is in `test_data/sqlfiles/`
3. `npm run dev` to run with the staging database or `npm run start:anon` to run with the anonymized small test-db included in the repository.
4. Check if it worked: The docker logs should have a line saying database connection works. Open `localhost:5173` in browser to check if frontend works and shows data.

**Errors while setting up**

Before any other debugging steps:

1. Make sure main branch is up to date
2. Make sure again, you didn't actually check did you...
3. Re-setup your environment with `npm run setup`
4. Remove existing containers and volumes `npm run <environment>:down`
5. Force rebuild it with `-- --build` flag: `npm run <environment> -- --build`
6. If problems persist, scream for help and hope someone hears you
7. Continue with other debugging steps
8. Repeat

**_Database_**
If the database fails to start with an error message `Cannot open directory /docker-entrypoint-initdb.d/. Permission denied`, the problem is most likely permissions. `dev` uses `data` directory and `anon` + `test` uses `test_data`.
Both directories and the files inside need the permissions `read` and `execute`. In Linux/GNU this can be achieved by running `chmod 755 DIRECTORY -R` where DIRECTORY is the wanted directory, `test_data` or `data`.
(NOTE: This gives `write` for all files and directories for current user. You can disable this by changing the first number to match the other two numbers.)

**_Backend or frontend_**

- `Cannot find module /usr/src/app/backend/src/index.ts`

  - Permission error with `backend/src`
  - Fixed by running `find backend/src -type d -exec chmod 755 {} \; && find backend/src -type f -exec chmod 644 {} \;` (on Linux).
  - The command gives permissions `read` and `execute` for directories and `read` for files inside `backend/src`.
  - NOTE: This gives `write` for all files and directories for current user. You can disable this by changing the first number to match the others.

- `Cannot find module ../../../frontend/src/shared/types`
  - Permission error with `frontend/src`
  - Fixed by running `find frontend/src -type d -exec chmod 755 {} \; && find frontend/src -type f -exec chmod 644 {} \;` (on Linux).
  - The command gives permissions `read` and `execute` for directories and `read` for files inside `frontend/src`.
  - NOTE: This gives `write` for all files and directories for current user. You can disable this by changing the first number to match the others.
