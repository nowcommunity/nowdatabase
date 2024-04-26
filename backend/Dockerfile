FROM node:20-alpine3.19 AS build

ENV TZ="Europe/Helsinki"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine3.19 AS node-run

WORKDIR /app

COPY --from=build /app/dist /app

EXPOSE 4000

CMD ["node build/index.js"]
