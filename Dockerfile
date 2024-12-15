# [1] Base Image
FROM oven/bun:1 as base

# [INSTALL] Dependencies
FROM base as install
WORKDIR /app
COPY package.json bun.lockb ./
# Needed for workspace deps
COPY packages ./packages/
RUN bun install --frozen-lockfile

# [2] Build image (including dev deps)
FROM install as build
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile

ARG MODEL_BOX_API_KEY
ENV MODEL_BOX_API_KEY=$MODEL_BOX_API_KEY

RUN test -n ${DIRECTUS_API_TOKEN}
RUN test -n ${DIRECTUS_URL}
RUN bun run build && bun run build:bin

# [SERVER]
FROM debian:buster-slim as server
COPY --from=build /app/app .
COPY --from=build /app/dist ./dist
# There's a bug in where bun bundle messes up the html-escaper module
# https://discord.com/channels/876711213126520882/1317424049890267137
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
USER 1000:1000
CMD ["./app"]
