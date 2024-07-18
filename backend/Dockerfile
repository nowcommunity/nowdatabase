FROM node:20-alpine3.16 AS backend-build

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend/src/validators

COPY frontend/src/backendTypes.d.ts /usr/src/app/frontend/src/
COPY frontend/src/validators /usr/src/app/frontend/src/validators
COPY frontend/src/types.ts /usr/src/app/frontend/src/types.ts
COPY backend/package.json backend/
COPY backend/package-lock.json backend/
COPY backend/prisma backend

ENV NODE_ENV=production

WORKDIR /usr/src/app/backend

RUN npm ci

COPY backend .
RUN npm run prisma
RUN rm -rf build
RUN npm run build

# NOTE: Has to be alpine3.16 because newer versions have changed a dependency, causing Prisma to fail
FROM node:20-alpine3.16 AS node-run

RUN mkdir -p /usr/src/app/backend/backend/prisma
WORKDIR /usr/src/app/backend

COPY --from=backend-build /usr/src/app/frontend/src/ ../frontend/src
COPY --from=backend-build /usr/src/app/backend/build .
COPY --from=backend-build /usr/src/app/backend/node_modules ./node_modules
COPY --from=backend-build /usr/src/app/backend/prisma ./backend/prisma

EXPOSE 4000
ENV NODE_ENV=production

#CMD ["sleep", "infinite"]
CMD ["node", "backend/src/index.js"]
