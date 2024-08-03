FROM node:20-alpine3.16

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend/src/validators

COPY backend/package.json backend/
COPY backend/package-lock.json backend/
COPY backend/prisma backend

WORKDIR /usr/src/app/backend

RUN npm ci

COPY backend .

RUN npm run prisma

CMD ["npm", "run", "dev"]
