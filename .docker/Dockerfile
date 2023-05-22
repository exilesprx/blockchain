FROM node:20.2.0-bullseye-slim as deps

WORKDIR /usr/app

COPY ./package.json /usr/app/

COPY ./package-lock.json /usr/app/

#
FROM deps as dev

RUN npm ci

COPY --from=deps /usr/app/package.json /usr/app/

COPY babel.config.js /usr/app/

COPY jest.config.ts /usr/app/

COPY ./src /usr/app/src

COPY ./tests /usr/app/tests


#
FROM deps as build

RUN npm ci --omit=dev

WORKDIR /usr/app

COPY --from=deps /usr/app/package.json /usr/app/

COPY ./nodemon.json /usr/app/nodemon.json

COPY ./tsconfig.json /usr/app/tsconfig.json

COPY ./src /usr/app/src

RUN chown -R node. .

CMD [ "node" ]