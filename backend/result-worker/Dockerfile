FROM node:25-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]