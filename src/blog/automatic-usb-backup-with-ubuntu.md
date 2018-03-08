---
path: "/blog/automatic-usb-backup-with-ubuntu"
date: "2010-08-10T17:35:44.000Z"
title: "Automatic USB backup with Ubuntu"
tags: ["blog"]
---

**As a part of my site restoration, this page was salvaged and may not be up to date** Everyone has important files like personal photographs, bank statements, a life's accumulation of porn and so and and so forth that would be hard or impossible to recover if that damn hard drive would fail. I've always been well aware of the dangers of not taking backups but yet still lazy enough to ignore it. Backup for the lazy includes the following steps:

*   Put USB stick in computer
*   Wait for computer to BEEP or USB stick to stop flashing
*   Unplug USB stick
*   Rinse and repeat!

I wrote a package that does the following:

*   Detects USB drives connected to the computer and runs the backup script
*   Only runs backup on partitions that match the configured volume_id
*   Mounts the volume
*   Runs rsync and takes an incremental copy of the files that have changed since a last backup.
*   Unmounts the volume
*   Gives a good or a bad beep through the PC speaker

Step by Step
------------

1.  Insert your USB stick/disk
2.  Make sure it has a usable partition. I use FAT32 so my Mac can also read it. (hint: System > Administration > Partition Editor)
3.  Download the two files and put them in the appropriate places
    *   /etc/udev/rules.d/[55-usb-backup.rules](/sites/andrioid.net/files/55-usb-backup.rules) (udev rule)
    *   /usr/local/bin/[usb-backup](/sites/andrioid.net/files/usb-backup) (shell script)
4.  Find the volume id of your partition and replace mine in the 'usb-backup' file `root@ubahmaskine: vol_id -u /dev/sdd1 4507-FB5A`
5.  Set SRC_DIR to the directory you want backed up within 'usb-backup'
6.  Make sure the 'usb-backup' file has the execute permission for root: `chmod 700 /usr/local/bin/usb-backup`
7.  Unplug USB stick
8.  Plug in USB stick
9.  After it beeps or stops flashing try mounting it f.e. `mount /dev/sdd1 /mnt/sdd1`
10.  Check if all your files made it accross
11.  Unmount the volume again f.e. `umount /dev/sdd1`
12.  Unplug and plug it in again once a week or so.
13.  For audio beep to work you need the 'beep' package (apt-get install beep)

Notes and credit
----------------

*   Thanks to [Anders](http://anderstornvig.dk) for his original idea and implementation of this.
*   The script does not check if the volume has enough space to do the backup. If it doesn't, it will fail!
*   If umounting seems slow, it's due to delayed write to the USB drive.
*   Should work on other Linux distributions as long as udev is present.
*   This is provided 'as is' and offers **no guarantee**. Use at your own risk!