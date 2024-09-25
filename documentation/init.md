### Initializing the application

**Setup DB restore** :cd:

1. Make an empty directory `sqlfiles` inside `data` folder which is in the repository root. 
2. Place the database dump files `now_test.sql`, `now_log_test.sql` and `now_view.sql` inside it.
3. Notice, that the container will have to be able to read these files and execute `data/restore_and_create_user.sql`, so you may have to adjust the necessary rights depending on your operating system.

See [technical explanations](technical_explanations.md) for how this works.

**Init the project** :rocket:

Requirements: Some modern installation of Docker engine with Docker compose.

1. Copy the `.env.template` file named as `.dev.env`
2. `npm run setup` in project root to install all node modules and generate prisma-client.
3. If you wish to use the staging database, you need to copy the dump files into `data/sqlfiles/` directory. See example of how anonymized test data is in `test_data/sqlfiles/`
4. `npm run dev` to run with the staging database or `npm run start:anon` to run with the anonymized small test-db included in the repository.
5. Check if it worked: The docker logs should have a line saying database connection works. Open `localhost:5173` in browser to check if frontend works and shows data.

**Errors while setting up**

***Database***
If the database fails to start with an error message `Cannot open directory /docker-entrypoint-initdb.d/. Permission denied`, the problem is most likely permissions. `dev` uses `data` directory and `anon` + `test` uses `test_data`.
Both directories and the files inside need the permissions `read` and `execute`. In Linux/GNU this can be achieved by running `chmod 755 DIRECTORY -R` where DIRECTORY is the wanted directory, `test_data` or `data`.
(NOTE: This gives `write` for all files and directories for current user. You can disable this by changing the first number to match the other two numbers.)

***Backend or frontend***
* `Cannot find module /usr/src/app/backend/src/index.ts`
    - Permission error with `backend/src`
    - Fixed by running `find backend/src -type d -exec chmod 755 {} \; && find backend/src -type f -exec chmod 644 {} \;` (on Linux).
    - The command gives permissions `read` and `execute` for directories and `read` for files inside `backend/src`.
    - NOTE: This gives `write` for all files and directories for current user. You can disable this by changing the first number to match the others.

* `Cannot find module ../../../frontend/src/types`
    - Permission error with `frontend/src`
    - Fixed by running `find frontend/src -type d -exec chmod 755 {} \; && find frontend/src -type f -exec chmod 644 {} \;` (on Linux).
    - The command gives permissions `read` and `execute` for directories and `read` for files inside `frontend/src`.
    - NOTE: This gives `write` for all files and directories for current user. You can disable this by changing the first number to match the others.
