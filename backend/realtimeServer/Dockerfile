FROM node:20-slim

WORKDIR /usr/src/realtimeServer

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install

RUN npm install pm2 -global

COPY . .

EXPOSE 3001

CMD ["pm2-runtime", "app.js"]
