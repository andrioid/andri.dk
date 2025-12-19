# Note: This doesnt build anything, just sets up for hosting
FROM jdxcode/mise:latest AS tools
# [DEPENDENCIES]
FROM tools AS dependencies

RUN useradd -m -u 1000 app && mkdir -p /app && chown app:app /app && chown app:app /mise -R
USER app
WORKDIR /app
COPY mise.toml package.json package-lock.json ./
RUN mise trust && mise install
# Needed for workspace deps
COPY packages ./packages/
RUN npm ci

FROM dependencies as build
ARG MODEL_BOX_API_KEY
ENV MODEL_BOX_API_KEY=$MODEL_BOX_API_KEY

COPY . .
RUN npm run build

FROM build as server-build
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
