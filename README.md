# Nowdatabase

**NOW - New and Old Worlds - Database of fossil mammals**

Rebuild of a fossil database application, old version at https://nowdatabase.luomus.fi/ (New version not deployed yet)

_____

# Developer instructions

### Running the project :rocket:

1. Run `npm install` in all three folders: Project root, frontend, and backend.
2. At this point, do the db-restore things as instructed below.
3. If you have docker compose installed, run `npm run dev` in project root to launch docker in development mode.
4. Check if it worked: The docker logs should have a line saying database connection works. Open `localhost:5173` in browser to check if frontend works.

### Restoring db from dump :cd:

1. Make an empty directory `sqlfiles` inside `data` folder which is in the repository root. 
2. Place the database dump files `now_test.sql`, `now_log_test.sql` and `now_view.sql` inside it.
3. Notice, that the container will have to be able to read these files and execute `data/restore_and_create_user.sql`, so you may have to adjust the necessary rights depending on your operating system.

**How does it work?** The mariadb-container by default executes all .sql files it finds in the containers `/docker-entrypoint-initdb.d/` directory when the container is run the first time. The `data` directory is mounted there. It contains an initialization file (`restore_and_create.sql`) which will then restore the database from the sql-dumpfiles in `sqlfiles/`, and also create a user `'now_test'@'localhost'` with a password defined as MARIADB_PASSWORD in the .db.dev.env file for the database.

### Accessing database inside docker

`docker exec -it nowdb-db mariadb -u now_test -p --database now_test`. Enter the password defined in `.db.dev.env`, the default is`mariadb_password`. 

### Sequelize models

The sequelize model definitions in `backend/src/models` were generated automatically by [sequelize-auto](https://github.com/sequelize/sequelize-auto). This generates the model files from the database, plus an `init-models.ts` file, which exports initModels-function that you can use to initialize all models. So to access database, you simply import `models` from utils/db.ts.

This has a [problem](https://github.com/nowcommunity/nowdatabase/issues/15), however. For now, we need to use raw queries: `raw: true` otherwise the fields are not accessible.