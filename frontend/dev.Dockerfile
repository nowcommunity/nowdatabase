FROM node:20-alpine3.19

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

COPY package.json ./

COPY package-lock.json ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
