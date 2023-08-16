FROM node:20.5.1-bullseye-slim as deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app

COPY ./package.json /usr/app/

COPY ./pnpm-lock.yaml /usr/app/

#
FROM deps as dev

RUN pnpm i

COPY --from=deps /usr/app/package.json /usr/app/

COPY babel.config.js /usr/app/

COPY jest.config.ts /usr/app/

COPY ./src /usr/app/src

COPY ./tests /usr/app/tests


#
FROM deps as build

RUN pnpm i --prod

WORKDIR /usr/app

COPY --from=deps /usr/app/package.json /usr/app/

COPY ./nodemon.json /usr/app/nodemon.json

COPY ./tsconfig.json /usr/app/tsconfig.json

COPY ./src /usr/app/src

RUN chown -R node. .

CMD [ "node" ]