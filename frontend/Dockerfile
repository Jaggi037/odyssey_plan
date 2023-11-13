FROM node:20-slim

WORKDIR /usr/src/frontend

COPY package.json .

COPY package-lock.json .

RUN npm install


EXPOSE 3000


CMD ["npm", "run", "dev"]
