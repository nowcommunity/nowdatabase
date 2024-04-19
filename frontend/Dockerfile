FROM node:20-alpine3.19 AS build

ENV TZ="Europe/Helsinki"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine3.19 AS serve

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/dist /app

EXPOSE 5173

CMD ["serve", "-s", "/app", "-l", "5173"]