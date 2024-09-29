# [Deps] Install dependencies only when needed
FROM oven/bun:1 as base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app


FROM base as install
RUN mkdir -p /temp/dev
# Install dependencies based on the preferred package manager

# Note packages are needed to solve workspace deps
COPY package.json bun.lockb packages /temp/dev/

RUN cd /temp/dev && bun install --frozen-lockfile
COPY . .

ARG DIRECTUS_API_TOKEN
ENV DIRECTUS_TOKEN=$DIRECTUS_API_TOKEN
ARG DIRECTUS_URL
ENV DIRECTUS_URL=$DIRECTUS_URL
RUN test -n ${DIRECTUS_API_TOKEN}
RUN test -n ${DIRECTUS_URL}



RUN bun install --frozen-lockfile && bun run build

# [Static] Production image, copy build assets and run the standalone node server
FROM base as server
WORKDIR /app

EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["bun", "run", "start"]
