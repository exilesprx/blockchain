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

COPY ./tsconfig.json /usr/app/

COPY ./src /usr/app/src

RUN npm run build -- --project ./src/app/tsconfig.json


#
FROM node:16-alpine

WORKDIR /usr/app

COPY --from=deps /usr/app/node_modules /usr/app/node_modules

COPY --from=build /usr/app/build /usr/app

RUN chown -R node. .

CMD [ "node" ]