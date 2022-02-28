FROM node:alpine3.15 as deps

WORKDIR /usr/app

COPY ./package.json /usr/app/

COPY ./package-lock.json /usr/app/

RUN npm install

#
FROM node:alpine3.15 as build

WORKDIR /usr/app

COPY --from=deps /usr/app/node_modules /usr/app/node_modules

COPY --from=deps /usr/app/package.json /usr/app/

COPY tsconfig.json /usr/app/

COPY ./src /usr/app/src

COPY ./src/app/index.rx /usr/app/src/index.ts

RUN npm run build --verbose


#
FROM node:alpine3.15

WORKDIR /usr/app

COPY --from=build /usr/app/build /usr/app

RUN chown -R node. .

CMD [ "node" ]