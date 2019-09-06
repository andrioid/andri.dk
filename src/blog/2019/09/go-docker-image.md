---
path: "/blog/2019/09/slim-docker-images-for-golang"
date: "2019-09-06T00:00:00.000Z"
title: "Slim Docker images for your Go application"
tags: ["hosting", "docker", "golang"]
draft: false
---

How to build a slim Docker container for your Go application using multi-stage images.

I'm using Go 1.13 and the community module proxy to build the binary and Alpine as a base image. It adds a user and group instead of running as root.

### Dockerfile

Be sure to replace "cmd/server/server.go" with your main file.

```dockerfile
FROM golang:1.13 as builder

WORKDIR /app
COPY . /app
RUN CGO_ENABLED=0 GOOS=linux GOPROXY=https://proxy.golang.org go build -o app cmd/server/server.go

FROM alpine:latest
# mailcap adds mime detection and ca-certificates help with TLS (basic stuff)
RUN apk --no-cache add ca-certificates mailcap && addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app
COPY --from=builder /app/app .
ENTRYPOINT [ "./app" ]
```

I hope this is helpful. I mostly blogged this to document it for myself.
