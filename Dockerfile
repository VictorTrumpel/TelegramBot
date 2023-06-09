FROM node:alpine

WORKDIR /app

RUN npm i

COPY . .

CMD [ "node", "src/app.js" ]