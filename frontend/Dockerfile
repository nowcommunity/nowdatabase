FROM node:20-alpine3.19 AS build

ARG BACKEND_URL="http://localhost:4000"
ARG ENABLE_WRITE="false"
ARG RUNNING_ENV

ENV TZ="Europe/Helsinki"

ENV VITE_BACKEND_URL=$BACKEND_URL
ENV VITE_RUNNING_ENV=$RUNNING_ENV
ENV VITE_ENABLE_WRITE=$ENABLE_WRITE
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine3.19 AS serve

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/dist /app

EXPOSE 5173

CMD ["serve", "-s", "/app", "-l", "5173"]