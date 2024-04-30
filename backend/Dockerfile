FROM node:20-alpine3.19 AS backend-build

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

ENV NODE_ENV=production

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine3.19 AS node-run

WORKDIR /usr/src/app

COPY --from=backend-build /usr/src/app/build /usr/src/app/build
COPY --from=backend-build /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "build/index.js"]
