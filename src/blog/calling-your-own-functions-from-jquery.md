---
path: "/blog/calling-your-own-functions-from-jquery"
date: "2010-08-10T16:23:57.000Z"
title: "Calling your own functions from jQuery"
tags: ["blog"]
---

**As a part of my site restoration, this page was salvaged and may not be up to date** I've been playing around with jQuery for a week or so, without any prior experience with Javascript. jQuery is absolutely brilliant and it's quite easy to do different things with it. However, when I started doing repetitive tasks, i wanted to create a function to do it; instead of repeating my code at multiple places. This is where I had problems, because my 'updateTable' function had no idea what $() was and no jQuery functions worked after I started calling my 'updateTable' function from the jQuery context. Well, today I got it to work by sending the jQuery object to my function. **Old function (does not work)**

> function updateTable () { /* Call jQuery stuff (for example, change forms) */ } $(function() { $(document).ready(function() { updateTable(); }); });

After spending a couple of days scratching my head and reading a bit about Javascript, this was 'obviously' a problem of my function not knowing the jQuery context or any of the objects inside it. There is probably a smarter way of doing this; but I at least solved my problem by appending the jQuery object '$' to the function, as follows. **New, less crappy version**

> function updateTable ($) { /* Call jQuery stuff (for example, change forms) */ } $(function() { $(document).ready(function() { updateTable($); }); });

**Update: Arnórs' suggestion**  
Arnór suggested that declaring the functions after $(document).ready will make all functions after that aware of the jQuery object (makes sense, but I haven't tried it).

> $(function() { $(document).ready(function() { function updateTable ($) { /* Call jQuery stuff (for example, change forms) */ } updateTable(); }); });

**Update: Guðmundur suggested creating a jQuery plugin**  
I decided to go with this advice everything is working so far. I recommend [this article](https://blog.jeremymartin.name/2008/02/building-your-first-jquery-plugin-that.html) as well.

> $(function() { $.fn.updateCart = function() { /* Misc jQuery stuff */ }; $(document).ready(function() { ('#mytable').updateTable(); }); });

As a footnote; I'm no Javascript or Jquery expert. Been playing around for a week and I found this information extremely hard to come by, so if it can help anyone else who's beginning to play with jQuery, then great..