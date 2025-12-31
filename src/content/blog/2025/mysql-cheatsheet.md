---
date: "2025-12-31T00:00:00.000Z"
tags:
  - MySQL
title: "MySQL/MariaDB cheatsheet"
---

A few useful snippets while using MariaDB/MySQL. Copied from my notes.

```sql
-- show slave status without your eyes bleeding
SHOW SLAVE STATUS\G

-- show master status
SHOW MASTER STATUS\G

-- processes
show processlist;

-- show users
SELECT User, Host FROM mysql.user;

--- show permissions
SHOW GRANTS FOR 'username'@'host';

-- change password
ALTER USER 'repl'@'%' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;

--- setup replica
STOP SLAVE;
SET GLOBAL gtid_slave_pos='xxx';
CHANGE MASTER TO MASTER_HOST='xxx', MASTER_PORT=3306, MASTER_USER='replica', MASTER_PASSWORD='xxx', MASTER_USE_GTID=slave_pos, MASTER_CONNECT_RETRY=3, MASTER_SSL_VERIFY_SERVER_CERT=0;
START SLAVE;
SHOW SLAVE STATUS;

CHANGE MASTER TO MASTER_HOST='xxx', MASTER_PORT=3306, MASTER_USER='replica', MASTER_PASSWORD='xxx', MASTER_USE_GTID=slave_pos, MASTER_CONNECT_RETRY=3, MASTER_SSL_VERIFY_SERVER_CERT=0;

SET GLOBAL gtid_slave_pos='xxx'

--- show mysql version
SELECT @@version AS 'MySQL Version';

--- connection status
SHOW STATUS WHERE Variable_name IN ('Threads_connected','Max_used_connections');
SHOW VARIABLES LIKE 'max_connections';
```
