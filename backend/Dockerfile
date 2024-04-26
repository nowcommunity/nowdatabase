FROM node:20-alpine3.19 AS build

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine3.19 AS node-run

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build /usr/src/app

EXPOSE 4000

CMD ["node", "build/index.js"]
