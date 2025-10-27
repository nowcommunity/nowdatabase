FROM node:22-alpine3.20 AS dev

ENV TZ="Europe/Helsinki"

RUN apk --no-cache add curl
RUN  npm i -g npm

USER node
WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend/src/shared/validators
RUN mkdir -p /usr/src/app/data

COPY --chown=node frontend/src/shared /usr/src/app/frontend/src/shared/
COPY --chown=node ./data /usr/src/app/data/
COPY --chown=node ./backend/package.json backend/
COPY --chown=node ./backend/package-lock.json backend/
COPY --chown=node ./backend/prisma/schema.prisma backend
COPY --chown=node ./backend/prisma/schema_log.prisma backend

WORKDIR /usr/src/app/backend

RUN npm ci

# Be careful with this! Copying local node_modules makes bcrypt.hash fail silently with exit 139!!
# (incompatible libc versions)
COPY --chown=node ./backend .

RUN npm run prisma

CMD ["npm", "run", "dev"]


FROM dev AS api-tests

CMD ["npm", "run", "test:api"]
