# Nowdatabase

**NOW - New and Old Worlds - Database of fossil mammals**

Rebuild of a fossil database application, old version at https://nowdatabase.luomus.fi/ (New version not deployed yet)

_____

# Developer instructions

### Running the project

1. Run `npm install` in all three folders: Project root, frontend, and backend.
2. Add a file named `.db.env` into project root with necessary environment variables.
3. At this point, do the db-restore things as instructed below.
4. If you have docker compose installed, run `npm run dev` in project root to launch docker in development mode.
5. Check if it worked: The docker logs should have a line saying database connected successfully. Open `localhost:5173` in browser to check if frontend works.

### Restoring db from dump :cd:

1. Make an empty directory `sqlfiles` inside `data` folder which is in the repository root. 
2. Place the database dump files `now_test.sql`, `now_log_test.sql` and `now_view.sql` inside it.
3. Notice, that the container will have to be able to read these files and execute `data/restore_and_create_user.sql`, so you may have to adjust the necessary rights depending on your operating system.
4. Then simply run everything by `npm run dev`.

**How does it work?**

The mariadb-container by default executes all .sql files it finds in the containers `/docker-entrypoint-initdb.d/` directory when the container is run the first time. The `data` directory is mounted there. It cotnains an initialization file (`restore_and_create.sql`) which will then restore the database from the sql-dumpfiles in `sqlfiles/`, and also create a user `'now_test'@'localhost'` with password `mariadb_password` for the database.

**Test that it worked:**

`docker exec -it nowdb-db mariadb -u now_test -p`. Enter the password `mariadb_password`. 

Select database with `USE now_test;`.

Execute query: `select loc_name from now_loc where loc_name like "amb%";` which should print 9 rows if everything went right.

### Sequelize models

The sequelize model definitions in `backend/src/models` were generated automatically by [sequelize-auto](https://github.com/sequelize/sequelize-auto). This generates the model files from the database, plus an `init-models.ts` file, which exports initModels-function that you can use to initialize all models. So to access database, you simply import `models` from utils/db.ts.
