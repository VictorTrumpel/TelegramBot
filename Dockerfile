FROM node:alpine

WORKDIR /app

COPY . .

CMD [ "node", "src/app.js" ]