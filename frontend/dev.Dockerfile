FROM node:20-alpine3.19

ENV TZ="Europe/Helsinki"

USER node
WORKDIR /usr/src/app

COPY --chown=node package.json ./
COPY --chown=node package-lock.json ./
RUN npm ci

COPY --chown=node . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
