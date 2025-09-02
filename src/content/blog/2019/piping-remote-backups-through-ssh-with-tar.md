---
date: "2010-08-10T00:00:00.000Z"
ogImage: 2019/piping-remote-backups-through-ssh-with-tar.png
slug: piping-remote-backups-through-ssh-with-tar
tags:
    - linux
title: Piping remote backups through SSH with tar
---
**As a part of my site restoration, this page was salvaged and may not be up to date**

While usually operating some sort of backup systems, it may become necessary to perform at remote backup of a machine without initiating locally. There can be a number of reasons to do this, such as:

- You do not trust the operator of the machine you need to backup from. Various tools may be compromised to grab your passwords.
- There is no space left on the machine to store the backup file

### From the receiving machine (backup to)

```bash
# Using bzip2 as compression ssh user@remote-machine.com
tar cj remote\_folder\_name1 remote\_folder\_name2 > backup.tar.bz
# Using gzip as compression ssh user@remote-machine.com
tar cz remote\_folder\_name1 remote\_folder\_name2 > backup.tar.gz
```

You will be prompted for a password before the command is run. If you need this to be automatic, you can use password-less public key authentication instead (although I will not cover it here). If you risk that your session might die before finishing the copy, try something like 'screen' before running the command. This shouldn't be much of a revelation to most linux geeks, but useful non the less and written here for documentation purposes.
