# [Deps] Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN \
    if [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm fetch; \
    else echo "Lockfile not found." && exit 1; \
    fi


WORKDIR /app
COPY . .

RUN pnpm install -r --offline && npm run build

# [Static] Production image, copy build assets and run the standalone node server
FROM deps as server
WORKDIR /app

EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["node", "server.mjs"]

