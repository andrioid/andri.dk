---
slug: "icelandic-virtual-keyboard-for-meego-harmattan"
date: "2011-12-07T09:55:04.000Z"
title: "Icelandic Virtual Keyboard for Meego Harmattan"
tags: ["meego", "Projects"]
---

Coming from a nation of 300.000 people has its downsides, like lack of keyboard support on various platforms. So, when I got my awesome Nokia N9, I wasn't all that surprised that there was no text input option for "Íslenska" or Icelandic. Fortunately, The Nokia N9 is mostly open source and the on screen keyboard uses [Maliit](https://wiki.maliit.org/). For those who like custom keyboards, they can check out [MesInput](http://mesinput.com). I have created a virtual keyboard file for Icelandic and contributed it to the MesInput project (awaiting confirmation). Until then, you can download the file from [here](http://dl.dropbox.com/u/25593/andrioid.net/is.xml): Then place it into: `/home/user/.config/meego-keyboard/layouts` The file can be uploaded through the SDK (sftp/ssh) or through USB mass storage (untested). Edit: Óli mentioned that Hátækni made a similar VKB file. It can be downloaded as a .deb file from [their site](http://www.hataekni.is/gogn/gogn/is_keyboard_0.2.deb). I've looked through the file and the main difference is that they do not provide all of the accented characters, common to Nordic languages. In any case, it's all good.
