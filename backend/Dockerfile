FROM node:22-alpine3.20 AS backend-build

ENV TZ="Europe/Helsinki"

RUN  npm i -g npm
WORKDIR /usr/src/app

USER node

COPY --chown=node frontend/src/shared /usr/src/app/frontend/src/shared/
COPY --chown=node ./data /usr/src/app/data/
COPY --chown=node backend/package.json backend/
COPY --chown=node backend/package-lock.json backend/
COPY --chown=node backend/prisma/schema.prisma backend
COPY --chown=node backend/prisma/schema_log.prisma backend

ENV NODE_ENV=production

WORKDIR /usr/src/app/backend

RUN npm ci

# Be careful with this! Copying local node_modules makes bcrypt.hash fail silently with exit 139!!
COPY --chown=node backend .
RUN npm run prisma
RUN npm run build


FROM node:22-alpine3.20 AS node-run

# healthcheck needs this
USER root
RUN apk --no-cache add curl

# following mkdir needs root (for some reason)
RUN mkdir -p /usr/src/app/backend/prisma
RUN chown node:node /usr/src/app -R

WORKDIR /usr/src/app
USER node

COPY --from=backend-build --chown=node /usr/src/app/frontend/src/shared/ ../frontend/src/shared/
COPY --from=backend-build --chown=node /usr/src/app/data ./data
COPY --from=backend-build --chown=node /usr/src/app/backend/build .
COPY --from=backend-build --chown=node /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=backend-build --chown=node /usr/src/app/backend/prisma ./backend/prisma

WORKDIR /usr/src/app/backend

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
