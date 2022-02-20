FROM node:alpine3.15 as deps

COPY ./package.json /usr/app/

COPY ./package-lock.json /usr/app/

WORKDIR /usr/app

RUN npm install

#
FROM node:alpine3.15 as build

COPY --from=deps /usr/app/node_modules /usr/app/node_modules

COPY --from=deps /usr/app/package.json /usr/app/

WORKDIR /usr/app

COPY tsconfig.json /usr/app/

COPY ./src /usr/app/src

RUN npm run build --verbose


#
FROM node:alpine3.15

COPY --from=build /usr/app/build /usr/app

WORKDIR /usr/app

RUN chown -R node. .

CMD [ "node" ]