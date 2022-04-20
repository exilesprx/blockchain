FROM node:17-slim as deps

WORKDIR /usr/app

COPY ./package.json /usr/app/

COPY ./package-lock.json /usr/app/

RUN npm ci --production=false

#
FROM deps as tests

WORKDIR /usr/app

COPY --from=deps /usr/app/node_modules /usr/app/node_modules

COPY --from=deps /usr/app/package.json /usr/app/

COPY babel.config.js /usr/app/

COPY jest.config.ts /usr/app/

COPY ./src /usr/app/src

COPY ./tests /usr/app/tests