FROM node:25-alpine3.21

RUN apk update && apk add --no-cache \
    bash \
    bubblewrap \
    build-base \
    openjdk17-jdk \
    python3

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chmod +x run-in-bwrap.sh

CMD ["node", "index.js"]