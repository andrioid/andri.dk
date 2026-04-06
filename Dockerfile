# Note: This doesnt build anything, just sets up for hosting
FROM jdxcode/mise:latest AS tools
# [DEPENDENCIES]
FROM debian:trixie-slim AS dependencies

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 app && mkdir -p /app && chown app:app /app

# Copy mise binary and data with correct ownership — no expensive recursive chown
COPY --from=tools /usr/local/bin/mise /usr/local/bin/mise
COPY --from=tools --chown=app:app /mise /mise

ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV PATH="/mise/shims:$PATH"
ENV MISE_CACHE_PRUNE_AGE="10y"

USER app
WORKDIR /app
COPY mise.toml package.json package-lock.json ./
RUN mise trust && mise install
# Needed for workspace deps
COPY packages ./packages/
RUN npm ci

FROM dependencies AS build
ARG MODEL_BOX_API_KEY
ENV MODEL_BOX_API_KEY=$MODEL_BOX_API_KEY

COPY . .
RUN npm run build

FROM build AS server-build
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
ENTRYPOINT [ "npm" ]
CMD ["run", "start"]

# [SERVER]
# Note: We tried this single static file, but bun messes up ssr
FROM dependencies AS server
COPY . .
# If dist/ is missing, abort
RUN if [ ! -d dist ]; then echo "dist/ directory is missing. Please run 'npm run build' first." && exit 1; fi

# There's a bug in where bun bundle messes up the html-escaper module
# so we ship all packages as external and therefore require node_modules
# https://discord.com/channels/876711213126520882/1317424049890267137
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
ENTRYPOINT [ "npm" ]
CMD ["run", "start"]
