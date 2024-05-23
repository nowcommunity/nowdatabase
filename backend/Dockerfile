FROM node:20-alpine3.16 AS backend-build

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend/src/validators

COPY frontend/src/backendTypes.d.ts /usr/src/app/frontend/src/
COPY frontend/src/validators /usr/src/app/frontend/src/validators
COPY backend/package.json backend/
COPY backend/package-lock.json backend/
COPY backend/prisma backend

ENV NODE_ENV=production

WORKDIR /usr/src/app/backend

RUN npm ci

COPY backend .
RUN rm -rf build
RUN npm run build

# alpine3.16 because newer versions have changed a dependency, causing Prisma to fail
FROM node:20-alpine3.16 AS node-run

RUN mkdir -p /usr/src/app/backend
WORKDIR /usr/src/app/backend

COPY --from=backend-build /usr/src/app/backend/build .
COPY --from=backend-build /usr/src/app/backend/node_modules ./node_modules

EXPOSE 4000
ENV NODE_ENV=production
RUN pwd
CMD ["node", "backend/src/index.js"]

