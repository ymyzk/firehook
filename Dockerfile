FROM node:10.12-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY index.js config.js ./
COPY plugins ./plugins/

CMD ["node", "index.js"]
