FROM node:20-alpine3.16 AS backend-build

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/frontend/src/validators

USER node

COPY --chown=node frontend/src/backendTypes.d.ts /usr/src/app/frontend/src/backendTypes.d.ts
COPY --chown=node frontend/src/types.ts /usr/src/app/frontend/src/types.ts
COPY --chown=node frontend/src/validators /usr/src/app/frontend/src/validators
COPY --chown=node backend/package.json backend/
COPY --chown=node backend/package-lock.json backend/
COPY --chown=node backend/prisma backend

ENV NODE_ENV=production

WORKDIR /usr/src/app/backend

RUN npm ci

COPY --chown=node backend .
RUN npm run prisma
RUN npm run build


# NOTE: Has to be alpine3.16 because newer versions have changed a dependency, causing Prisma to fail
FROM node:20-alpine3.16 AS node-run

# following mkdir needs root (for some reason)
RUN mkdir -p /usr/src/app/backend/backend/prisma
RUN chown node:node /usr/src/app -R

WORKDIR /usr/src/app/backend
USER node

COPY --from=backend-build --chown=node /usr/src/app/frontend/src/backendTypes.d.ts ../frontend/src/backendTypes.d.ts
COPY --from=backend-build --chown=node /usr/src/app/frontend/src/types.ts ../frontend/src/types.ts
COPY --from=backend-build --chown=node /usr/src/app/backend/build .
COPY --from=backend-build --chown=node /usr/src/app/backend/node_modules ./node_modules
COPY --from=backend-build --chown=node /usr/src/app/backend/prisma ./backend/prisma

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "backend/src/index.js"]
