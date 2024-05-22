FROM node:20-alpine3.16 AS backend-build

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/frontend/src/
COPY frontend/src/backendTypes.d.ts /usr/src/frontend/
COPY backend/package.json ./
COPY backend/package-lock.json ./
COPY backend/prisma prisma

ENV NODE_ENV=production

RUN npm ci

COPY . .

WORKDIR /usr/src/app/backend

RUN npm run build

FROM node:20-alpine3.16 AS node-run

WORKDIR /usr/src/app

COPY --from=backend-build /usr/src/app/backend/build /usr/src/app/build
COPY --from=backend-build /usr/src/app/backend/node_modules /usr/src/app/node_modules
COPY --from=backend-build /usr/src/app/backend/prisma /usr/src/app/prisma

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "build/index.js"]
