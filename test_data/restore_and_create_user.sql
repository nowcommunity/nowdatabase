
DROP DATABASE IF EXISTS now_test; CREATE DATABASE now_test CHARACTER SET latin1;
DROP DATABASE IF EXISTS now_log_test; CREATE DATABASE now_log_test CHARACTER SET latin1;
SET names 'latin1';

USE now_test
SOURCE /docker-entrypoint-initdb.d/sqlfiles/now_test.sql
USE now_log_test
SOURCE /docker-entrypoint-initdb.d/sqlfiles/now_log_test.sql
USE now_test
SOURCE /docker-entrypoint-initdb.d/sqlfiles/now_view.sql

CREATE USER 'now_test'@'localhost' IDENTIFIED BY 'mariadb_password';
GRANT SELECT, INSERT, UPDATE ON `now_log_test`.* TO 'now_test'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `now_test`.* TO 'now_test'@'%';
