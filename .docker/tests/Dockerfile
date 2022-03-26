FROM node:alpine3.15 as deps

WORKDIR /usr/app

COPY ./package.json /usr/app/

COPY ./package-lock.json /usr/app/

RUN npm install --production=false

#
FROM node:alpine3.15 as tests

WORKDIR /usr/app

COPY --from=deps /usr/app/node_modules /usr/app/node_modules

COPY --from=deps /usr/app/package.json /usr/app/

COPY babel.config.js /usr/app/

COPY jest.config.ts /usr/app/

COPY ./src /usr/app/src

COPY ./tests /usr/app/tests