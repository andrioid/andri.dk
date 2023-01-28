---
slug: "2020/10/adding-web-apps-to-the-linux-desktop"
date: "2020-10-02T00:00:00.000Z"
title: "Adding Progressive Web Apps (PWA) to the Linux Desktop"
tags: ["linux"]
---

At work, we use Microsoft Teams, and we used to (and sort of still) use Slack. I recently switched from a Macbook Pro to a Linux laptop (again), and what annoys me greatly is that when I "share screen/application" in the Slack or Teams app it offers me only to share my entire monitor.

Sure, it's annoying that I can't pick what window is shared; but what makes it unbearable for other people on my team is that my monitor is ultra-wide so everything I share becomes really tiny on their screen. Sorry.

### Chrome can do it!

By accident, I stumbled upon that Slack running in Chrome on Linux can share windows just fine. The native Slack app does not. So I went on an adventure to figure out how to add web-apps to the Linux desktop and it's surprisingly hard to find (hence this post).

Chrome used to have a link in "More Tools -> Add to Desktop", but no more; and that had me confused. It's now called "More Tools -> Create Shortcut".

![Create Shortcut in Chrome](create-shortcut-chrome.png)

Just navigate to the site you want to open as an application, click "Create Shortcut" from the menu, check "Open as Window" and you're good.

On Linux, this will create a `.desktop` file in `~/.local/applications` so that your desktop environment will pick it up. This guide should also work fine on Windows and Mac.

### Plus, it's better!

Today, I'm running Outlook, Slack and Teams as progressive-web-applications and the performance is much better, screen/window sharing works and it uses less CPU than the Electron apps.
