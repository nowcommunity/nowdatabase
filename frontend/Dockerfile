FROM node:22-alpine3.20 AS build

ARG BACKEND_URL="http://localhost:4000"
ARG ENABLE_WRITE="false"
ARG RUNNING_ENV
ARG GEONAMES_USERNAME

ENV TZ="Europe/Helsinki"

ENV VITE_BACKEND_URL=$BACKEND_URL
ENV VITE_RUNNING_ENV=$RUNNING_ENV
ENV VITE_ENABLE_WRITE=$ENABLE_WRITE
ENV VITE_GEONAMES_USERNAME=$GEONAMES_USERNAME
USER node

WORKDIR /app


COPY --chown=node package.json ./
COPY --chown=node package-lock.json ./

RUN npm ci

COPY --chown=node . .

RUN npm run build

FROM node:22-alpine3.20 AS serve

RUN npm install -g serve

WORKDIR /app
USER node

COPY --from=build --chown=node /app/dist /app

EXPOSE 5173

CMD ["serve", "-s", "/app", "-l", "5173"]
