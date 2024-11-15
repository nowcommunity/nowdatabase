FROM node:22-alpine3.20

ARG BACKEND_URL="http://localhost:4000"
ARG ENABLE_WRITE="false"
ARG RUNNING_ENV

ENV TZ="Europe/Helsinki"

ENV VITE_BACKEND_URL=$BACKEND_URL
ENV VITE_RUNNING_ENV=$RUNNING_ENV
ENV VITE_ENABLE_WRITE=$ENABLE_WRITE

USER node
WORKDIR /usr/src/app

COPY --chown=node package.json ./
COPY --chown=node package-lock.json ./
RUN npm ci

COPY --chown=node . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
