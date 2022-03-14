FROM node:16-alpine as deps

WORKDIR /usr/app

COPY ./package.json /usr/app/

COPY ./package-lock.json /usr/app/

RUN npm install

#
FROM node:16-alpine as build

WORKDIR /usr/app

COPY --from=deps /usr/app/node_modules /usr/app/node_modules

COPY --from=deps /usr/app/package.json /usr/app/

COPY ./nodemon.json /usr/app/nodemon.json

COPY ./src /usr/app/src

RUN chown -R node. .

CMD [ "node" ]