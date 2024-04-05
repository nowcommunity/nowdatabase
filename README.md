# Nowdatabase

**NOW - New and Old Worlds - Database of fossil mammals**

Rebuild of a fossil database application, old version at https://nowdatabase.luomus.fi/ 

New version not deployed yet.

## Developer instructions

Run `npm install` in all three folders: Project root, frontend, and backend.

If you have docker compose installed, run `npm run dev` in root to launch docker in development mode. Then, open `localhost:5173` in browser.

### Restoring db from dump :cd:

Make an empty directory `sqlfiles` inside `data` folder which is in the repository root. Then, put the database dump files `now_test.sql`, `now_log_test.sql` and `now_view.sql` inside it. Notice, that the container will have to be able to read these files and execute `data/restore_and_create_user.sql`, so you may have to adjust the necessary rights depending on your operating system.

Then simply run everything by `npm run dev`.

The initialization file (`restore_and_create.sql`) will then restore the database from these files when the container is first run, and also creates a user `'now_test'@'localhost'` with password `mariadb_password` for the database. The root users password will be `admin`.

**Test that it worked:**

`docker exec -it nowdb-db mariadb -u now_test -p`. Enter the password `mariadb_password`. 

Select database with `USE now_test;`.

Execute query: `select loc_name from now_loc where loc_name like "amb%";` which should print 9 rows if everything went right.