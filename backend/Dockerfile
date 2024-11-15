FROM node:22-alpine3.20 AS backend-build

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/frontend/src/validators

USER node

COPY --chown=node frontend/src/backendTypes.d.ts /usr/src/app/frontend/src/backendTypes.d.ts
COPY --chown=node frontend/src/types.ts /usr/src/app/frontend/src/types.ts
COPY --chown=node frontend/src/validators /usr/src/app/frontend/src/validators
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


# NOTE: Has to be alpine3.16 because newer versions have changed a dependency, causing Prisma to fail
FROM node:22-alpine3.20 AS node-run

# healthcheck needs this
USER root
RUN apk --no-cache add curl

# following mkdir needs root (for some reason)
RUN mkdir -p /usr/src/app/backend/prisma
RUN chown node:node /usr/src/app -R

WORKDIR /usr/src/app
USER node

COPY --from=backend-build --chown=node /usr/src/app/frontend/src/backendTypes.d.ts ../frontend/src/backendTypes.d.ts
COPY --from=backend-build --chown=node /usr/src/app/frontend/src/types.ts ../frontend/src/types.ts
COPY --from=backend-build --chown=node /usr/src/app/backend/build .
COPY --from=backend-build --chown=node /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=backend-build --chown=node /usr/src/app/backend/prisma ./backend/prisma

WORKDIR /usr/src/app/backend

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "src/index.js"]


FROM node:22-alpine3.20 AS api-tests

USER node
COPY --chown=node --from=backend-build /usr/src/app /usr/src/app

WORKDIR /usr/src/app/backend

RUN npm ci
RUN npm run prisma

CMD ["npm", "run", "test"]
