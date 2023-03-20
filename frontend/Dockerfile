ARG NODE_IMAGE=node:16.13.1-alpine

FROM $NODE_IMAGE AS base
WORKDIR /home/node/app
RUN npm install yarn
COPY . ./
RUN yarn install

FROM base AS dependencies
EXPOSE 3000:3000
CMD yarn start

