
### Database

**DB-dump restoring process** 

The mariadb-container by default executes all .sql files it finds in the containers `/docker-entrypoint-initdb.d/` directory when the container is run the first time. The `data` directory is mounted there. It contains an initialization file (`restore_and_create.sql`) which will then restore the database from the sql-dumpfiles in `sqlfiles/`, and also create a user `'now_test'@'localhost'` with a password defined as MARIADB_PASSWORD in the .db.dev.env file for the database.

**Accessing database inside docker**

`docker exec -it nowdb-db mariadb -u now_test -p --database now_test` 

Enter the password defined in `.dev.env`.
