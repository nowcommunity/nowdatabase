
DROP DATABASE IF EXISTS now_test; CREATE DATABASE now_test CHARACTER SET latin1;
DROP DATABASE IF EXISTS now_log_test; CREATE DATABASE now_log_test CHARACTER SET latin1;
SET names 'latin1';

CREATE USER 'now_test'@'%' IDENTIFIED BY 'mariadb_password';

GRANT SELECT, INSERT, UPDATE, DELETE ON `now_test`.* TO 'now_test'@'%';
GRANT SELECT, INSERT, UPDATE ON `now_log_test`.* TO 'now_test'@'%';

USE now_test
SOURCE /docker-entrypoint-initdb.d/sqlfiles/now_anon.sql
USE now_log_test
SOURCE /docker-entrypoint-initdb.d/sqlfiles/now_log_anon.sql
USE now_test
