FROM node:20-alpine3.16 AS backend-build

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend/src/

COPY frontend/src/backendTypes.d.ts /usr/src/app/frontend/src/
COPY backend/package.json backend/
COPY backend/package-lock.json backend/
COPY backend/prisma backend

ENV NODE_ENV=production

WORKDIR /usr/src/app/backend

RUN npm ci

COPY backend .

RUN npm run build

# alpine3.16 because newer versions have changed a dependency, causing Prisma to fail
FROM node:20-alpine3.16 AS node-run

WORKDIR /usr/src/app

COPY --from=backend-build /usr/src/app/backend/build /usr/src/app/build
COPY --from=backend-build /usr/src/app/backend/node_modules /usr/src/app/node_modules

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "build/index.js"]
