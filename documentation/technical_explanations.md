
### Database

**DB-dump restoring process** 

The mariadb-container by default executes all .sql files it finds in the containers `/docker-entrypoint-initdb.d/` directory when the container is run the first time. The `data` directory is mounted there. It contains an initialization file (`restore_and_create.sql`) which will then restore the database from the sql-dumpfiles in `sqlfiles/`, and also create a user `'now_test'@'localhost'` with a password defined as MARIADB_PASSWORD in the .db.dev.env file for the database.

**Accessing database inside docker**

`docker exec -it nowdb-db mariadb -u now_test -p --database now_test` 

Enter the password defined in `.db.dev.env`, the default is`mariadb_password`. 

**Sequelize models**

The sequelize model definitions in `backend/src/models` were generated automatically by [sequelize-auto](https://github.com/sequelize/sequelize-auto). This generates the model files from the database, plus an `init-models.ts` file, which exports initModels-function that you can use to initialize all models. So to access database, you simply import `models` from utils/db.ts.

This has a [problem](https://github.com/nowcommunity/nowdatabase/issues/15), however. For now, we need to use raw queries: `raw: true` otherwise the fields are not accessible. This may be fixed in future.