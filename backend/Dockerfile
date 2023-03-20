FROM  node:16.13.1-alpine as build

WORKDIR /usr/src/app

COPY package*.json .

EXPOSE 4000:4000

RUN npm install

COPY . .

RUN chmod -R 777 ./node_modules/

RUN npm run build

FROM node:16.13.1-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --only=production

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]

