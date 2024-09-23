FROM node:20-alpine3.16

ENV TZ="Europe/Helsinki"

USER node
WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend/src/validators

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
