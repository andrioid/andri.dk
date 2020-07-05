# Starts from a simple Node image
FROM node:lts AS dependencies

# run yarn and other globals without root
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
RUN mkdir /home/node/app && chown node -R /home/node

WORKDIR /home/node/app
USER node

# Tells NPM what to fetch
COPY --chown=node package-lock.json package.json ./
RUN npm install --no-save

# Gatsby Build Stage
FROM node:lts AS gatsby
WORKDIR /home/node/app
RUN chown -R node /home/node
USER node
COPY --chown=node --from=dependencies /home/node/app/node_modules ./node_modules
COPY --chown=node . .
RUN npm run build

# nginx deliverable
FROM nginx:alpine as web

COPY devops/nginx.conf.template /etc/nginx/conf.d/configfile.template
COPY --from=gatsby /home/node/app/public /usr/share/nginx/html

ENV PORT 8080
ENV HOST 0.0.0.0

RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]