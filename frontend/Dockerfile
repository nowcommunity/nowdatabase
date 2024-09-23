FROM node:20-alpine3.19 AS build

ARG BACKEND_URL="http://localhost:4000"
ARG ENABLE_WRITE="false"
ARG RUNNING_ENV

ENV TZ="Europe/Helsinki"

ENV VITE_BACKEND_URL=$BACKEND_URL
ENV VITE_RUNNING_ENV=$RUNNING_ENV
ENV VITE_ENABLE_WRITE=$ENABLE_WRITE
USER node

WORKDIR /app


COPY --chown=node package.json ./
COPY --chown=node package-lock.json ./

RUN npm ci

COPY --chown=node . .

RUN npm run build

FROM node:20-alpine3.19 AS serve

RUN npm install -g serve

WORKDIR /app
USER node

COPY --from=build --chown=node /app/dist /app

EXPOSE 5173

CMD ["serve", "-s", "/app", "-l", "5173"]
