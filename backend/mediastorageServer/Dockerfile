FROM node:20-slim

WORKDIR /usr/src/mediastorageServer

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install

RUN npm install pm2 -global

COPY . .

EXPOSE 3002

CMD ["pm2-runtime", "app.js"]


