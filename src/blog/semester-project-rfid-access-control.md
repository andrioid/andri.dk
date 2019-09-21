---
path: '/blog/semester-project-rfid-access-control'
date: '2011-08-10T17:44:49.000Z'
title: 'Semester Project: RFID Access Control'
tags: ['Studies']
---

**Semester:** Spring of 2009
**Authors:** Andri Oskarsson, Christoffer Hjortlund

A RFID based access-control system using multi-threading, networking and existing MySQL databases. The idea was to create a better solution for concerts, sports events and such that rely on paper tickets for access. In particular the student organization of Aalborg University wanted a way of using the student cards for authentication.

It consists of a server, written in C and libevent for asynchronous socket handling. A client, written in C# for Windows and Windows Mobile (6.5 and below). Both entities make us of a MySQL server for data.
