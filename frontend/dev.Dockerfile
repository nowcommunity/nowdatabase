FROM node:20-alpine3.19

ENV TZ="Europe/Helsinki"

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm ci

COPY . .

RUN pwd

CMD ["npm", "run", "dev", "--", "--host"]
