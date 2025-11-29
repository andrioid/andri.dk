# Note: This doesnt build anything, just sets up for hosting
FROM jdxcode/mise:latest AS tools
COPY mise.toml .
RUN mise trust
RUN mise install

# [DEPENDENCIES]
FROM tools AS dependencies

RUN useradd -m -u 1000 app && mkdir -p /app && chown app:app /app
USER app
WORKDIR /app
COPY package.json package-lock.json ./
# Needed for workspace deps
COPY packages ./packages/
RUN mise trust
RUN npm ci

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
