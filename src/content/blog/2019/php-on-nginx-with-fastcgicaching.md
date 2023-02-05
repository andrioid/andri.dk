---
slug: "php-on-nginx-with-fastcgicaching"
date: "2013-05-12T12:21:07.000Z"
title: "PHP on nginx with fastcgi-caching"
tags: ["caching", "fastcgi", "php", "nginx", "blog"]
---

I have a little VPS that hosts my blog and other various small projects. With a recent nginx update, my configuration files stopped working and I had to cut fastcgi-caching from my setup. I spent about 2 hours searching for this, so I am putting it up here - in case anyone has uses for it. This setup uses php5-fpm and nginx.

### cache.conf

Include this from the nginx.conf (include /etc/nginx/cache.conf).

```nginx
fastcgi_cache_path /var/lib/nginx/cache levels=1:2 keys_zone=DEFAULT:10m inactive=5m; fastcgi_cache_key "$scheme$request_method$host$request_uri";
map $request_method $no_cache {
    default 0;
    POST 1;
    #no caching on post
}
map $http_cookie $no_cache {
    default 0;
    ~SESS 1;
    # PHP Session cookie
}
```

### php.conf

Include this from site configuration (for example: /etc/nginx/sites-enabled/example.com)

```
location ~ \.php {
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    # A handy function that became available in 0.7.31 that breaks down
    # The path information based on the provided regex expression
    # This is handy for requests such as file.php/some/paths/here/ fastcgi_param PATH_INFO
    $fastcgi_path_info;
    fastcgi_param PATH_TRANSLATED $document_root$fastcgi_path_info;
    fastcgi_param QUERY_STRING $query_string;
    fastcgi_param REQUEST_METHOD $request_method;
    fastcgi_param CONTENT_TYPE $content_type;
    fastcgi_param CONTENT_LENGTH $content_length;
    fastcgi_param SCRIPT_NAME $fastcgi_script_name;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param REQUEST_URI $request_uri;
    fastcgi_param DOCUMENT_URI $document_uri;
    fastcgi_param DOCUMENT_ROOT $document_root;
    fastcgi_param SERVER_PROTOCOL $server_protocol;
    fastcgi_param GATEWAY_INTERFACE CGI/1.1;
    fastcgi_param SERVER_SOFTWARE nginx;
    fastcgi_param REMOTE_ADDR $remote_addr;
    fastcgi_param REMOTE_PORT $remote_port;
    fastcgi_param SERVER_ADDR $server_addr;
    fastcgi_param SERVER_PORT $server_port;
    fastcgi_param SERVER_NAME $server_name;
    fastcgi_pass unix:/var/run/php5-fpm.sock;
    fastcgi_index index.php;
    fastcgi_cache DEFAULT;
    fastcgi_cache_valid 200 302 1h;
    fastcgi_cache_valid 301 1d;
    fastcgi_cache_valid 404 1m;
    fastcgi_cache_valid any 1m;
    fastcgi_cache_min_uses 1;
    fastcgi_cache_use_stale error timeout invalid_header http_500;
    fastcgi_cache_bypass $no_cache;
    fastcgi_no_cache $no_cache;
    fastcgi_ignore_headers Cache-Control Expires;
}
```

### example.com - Site configuration

```
server {
    listen 80 default;
    server_name *.example.com;
    access_log /var/log/nginx/example.access.log;
    root /home/andri/www/example.org;
    location / {
        root /var/www/example/scrolls.org;
        index index.html index.htm index.php;
    } include php.conf;
    location ~ /\.ht {
        deny all;
    }
}
```
