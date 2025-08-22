# Note: This doesnt build anything, just sets up for hosting
FROM jdxcode/mise:latest AS tools
WORKDIR /app/mise
COPY mise .
RUN mise trust
RUN mise install

# [DEPENDENCIES]
FROM tools AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
# Needed for workspace deps
COPY packages ./packages/
RUN npm ci

# [SERVER]
# Note: We tried this single static file, but bun messes up ssr
FROM dependencies AS server
COPY . .

# There's a bug in where bun bundle messes up the html-escaper module
# so we ship all packages as external and therefore require node_modules
# https://discord.com/channels/876711213126520882/1317424049890267137
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
USER 1000:1000
ENTRYPOINT [ "npm" ]
CMD ["run", "start"]
