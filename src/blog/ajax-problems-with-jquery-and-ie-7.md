---
path: "/blog/ajax-problems-with-jquery-and-ie-7"
date: "2011-08-15T16:03:30.000Z"
title: "AJAX problems with jQuery and IE 7"
tags: ["blog"]
---

I spent the day debugging a specific Javascript error in Internet Explorer. It seemed to have problems with fetching a JSON data file through $.ajax. For reference, the solution was to force IE to use ActiveX for xhr (found by Bjoggi at the [jQuery forums](https://forum.jquery.com/topic/object-doesn-t-support-this-property-or-method-from-jquery-1-4-1-in-ie7-only#14737000000881695)):

> $.ajaxSetup({ xhr: function() { if ($.browser.msie) { return new ActiveXObject("Microsoft.XMLHTTP"); } else { return new XMLHttpRequest(); } } });

Hope this helps anyone else - since searching for "ajax ie" results in a whole can of worms...