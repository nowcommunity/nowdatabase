FROM node:20

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

EXPOSE 5173

ENV NODE_ENV=production

COPY ./package* ./
RUN npm ci --include=dev
COPY . .

RUN npm run build && npm install -g serve@12.0.0

CMD ["serve", "--single", "--listen", "5173", "dist"]
