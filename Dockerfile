FROM node:10.15-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.js config.js ./
COPY plugins ./plugins/

CMD ["node", "index.js"]
