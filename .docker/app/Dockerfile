FROM node:18.12.1-bullseye-slim as deps

WORKDIR /usr/app

COPY ./package.json /usr/app/

COPY ./package-lock.json /usr/app/

RUN npm ci

#
FROM deps as build

WORKDIR /usr/app

COPY --from=deps /usr/app/node_modules /usr/app/node_modules

COPY --from=deps /usr/app/package.json /usr/app/

COPY ./nodemon.json /usr/app/nodemon.json

COPY ./tsconfig.json /usr/app/tsconfig.json

COPY ./src /usr/app/src

RUN chown -R node. .

CMD [ "node" ]