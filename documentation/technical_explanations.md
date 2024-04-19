
### Database

**DB-dump restoring process** 

The mariadb-container by default executes all .sql files it finds in the containers `/docker-entrypoint-initdb.d/` directory when the container is run the first time. The `data` directory is mounted there. It contains an initialization file (`restore_and_create.sql`) which will then restore the database from the sql-dumpfiles in `sqlfiles/`, and also create a user `'now_test'@'localhost'` with a password defined as MARIADB_PASSWORD in the .db.dev.env file for the database.

**Accessing database inside docker**

`docker exec -it nowdb-db mariadb -u now_test -p --database now_test` 

Enter the password defined in `.db.dev.env`, the default is `mariadb_password`. 

**Sequelize models generation**

The sequelize model definitions in `backend/src/models` were generated automatically by [a custom fork of sequelize-auto](https://github.com/ShootingStar91/sequelize-auto-fixed). This generates the model files from the database, plus an `init-models.ts` file, which exports initModels-function that you can use to initialize all models. So to access database, you simply import `models` from utils/db.ts. 

The custom fork was needed due to sequelize-auto not working well with Sequelize v6 and Typescript. Some fields were declared wrong as `field!: type` instead of `declare field: type`. If the database is modified and has to be created again, the fork linked above can be used like this:

`git clone https://github.com/ShootingStar91/sequelize-auto-fixed`

Compile it: `npm run tsc`

Run it. Easiest is to navigate into `nowdatabase/backend`, and there run something like:

`*path-to-sequelize-auto-repository*/bin/sequelize-auto -h localhost -d now_test -u now_test -x mariadb_password -p 3306  --dialect mariadb -o src/models -l ts`

* Put a relative or absolute path to the sequelize-auto repository in the beginning of the command.
* Have the nowdb application running (or only the mariadb container). If needed, also change the host, port, user and password in the command to whatever you use.
* Notice that this is for one db only, defined with: `-d now_test`. Change this for the other db's.
* Before the command, probably best to delete the whole models-folder and it's content: `rm src/models/*` (in backend-directory of course)
* After the command, you may have to lint it: `npx prettier --write src/models/*`
* There also may be unnecessary imports in some of the generated files. Do `npm run tsc` and if it complains, remove the imports by hand. 
