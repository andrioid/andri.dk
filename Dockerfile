# [1] Base Image
FROM oven/bun:1 as base

FROM base as install
COPY package.json bun.lockb ./
# Needed for workspace deps
COPY packages ./packages/
RUN bun install --frozen-lockfile

# [2] Build image (including dev deps)
FROM base as build
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile

ARG DIRECTUS_API_TOKEN
ENV DIRECTUS_TOKEN=$DIRECTUS_API_TOKEN
ARG DIRECTUS_URL
ENV DIRECTUS_URL=$DIRECTUS_URL
RUN test -n ${DIRECTUS_API_TOKEN}
RUN test -n ${DIRECTUS_URL}
RUN bun run build && bun run build:bin

# [SERVER] Heavy, includes all of the node stuff
FROM build as server
WORKDIR /app
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["./app"]

# [SLIM] Somewhat slim. Includes dist and binary
FROM base as bunserver
COPY --from=build /app/app .
COPY --from=build /app/dist ./dist
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
USER 1000:1000
CMD ["./app"]
