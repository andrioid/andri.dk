FROM jdxcode/mise:latest AS tools

RUN mise use -g bun@1 node@lts

# [DEPENDENCIES]
FROM tools AS dependencies

WORKDIR /app
COPY package.json bun.lockb ./
# Needed for workspace deps
COPY packages ./packages/
RUN bun install --frozen-lockfile

# [BUILD]
FROM dependencies AS build

ARG MODEL_BOX_API_KEY
ENV MODEL_BOX_API_KEY=$MODEL_BOX_API_KEY


WORKDIR /app
COPY . .
RUN bun run build && bun run build:bin
RUN bun install --frozen-lockfile --production

# [SERVER]
# Note: We tried this single static file, but bun messes up ssr
FROM build AS server

ARG MODEL_BOX_API_KEY
ENV MODEL_BOX_API_KEY=$MODEL_BOX_API_KEY

# There's a bug in where bun bundle messes up the html-escaper module
# so we ship all packages as external and therefore require node_modules
# https://discord.com/channels/876711213126520882/1317424049890267137
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
USER 1000:1000
ENTRYPOINT [ "npm" ]
CMD ["run", "start"]
