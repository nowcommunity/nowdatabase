
### Database

**DB-dump restoring process** 

The mariadb-container by default executes all .sql files it finds in the containers `/docker-entrypoint-initdb.d/` directory when the container is run the first time. The `data` directory is mounted there. It contains an initialization file (`restore_and_create.sql`) which will then restore the database from the sql-dumpfiles in `sqlfiles/`, and also create a user `'now_test'@'localhost'` with a password defined as MARIADB_PASSWORD in the .db.dev.env file for the database.

**Accessing database inside docker**

`docker exec -it nowdb-db mariadb -u now_test -p --database now_test` 

Enter the password defined in `.dev.env`.

**Updating prisma-schema**

If the database schema is changed, prisma-schema must be also updated. The smart prisma-way would be to run migrations via prisma, but I did this:

+ The database was modified directly in SQL
+ Anon-db dump was updated to reflect the changes by hand (for both the table structure and the data inputted to it)
+ Also the test-db dump used locally was changed by hand, but this may be more complicated if theres a lot of data - in which case a new dump must be taken from the db after changes
  + Notice that for the db-container to initialize data, you must remove the container and then the volume and rebuild
+ I ran the dev version of the app `npm run dev`
+ I ran `docker exec -it nowdb-backend-dev npx prisma db pull`
+ The schema was updated and the changes can be committed to github.

Prisma documentation: https://www.prisma.io/docs/orm/reference/prisma-cli-reference#db-pull

**Mariadb-connector and transactions**

Prisma does not have proper support for connecting to multiple databases, and transactionality between them is therefore impossible. We need transactional write to both now and now_log databases. Therefore we use mariadb-connector for the write operations that need to be logged into the log-database.
