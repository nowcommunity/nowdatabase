FROM node:22-alpine3.20 as dev

ENV TZ="Europe/Helsinki"

RUN apk --no-cache add curl
RUN  npm i -g npm

USER node
WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend/src/shared/validators

COPY --chown=node ./frontend/src/backendTypes.d.ts /usr/src/app/frontend/src/backendTypes.d.ts
COPY --chown=node ./frontend/src/types.ts /usr/src/app/frontend/src/types.ts
COPY --chown=node ./frontend/src/shared/validators /usr/src/app/frontend/src/shared/validators

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


FROM dev as api-tests

CMD ["npm", "run", "test:api"]
