FROM node:20.7.0-bookworm-slim AS source

RUN corepack enable \
  && corepack prepare pnpm@latest --activate


FROM exilesprx/blockchain:source AS main

COPY package.json /usr/app/

COPY pnpm-lock.yaml /usr/app/

COPY babel.config.js /usr/app/

COPY jest.config.ts /usr/app/

COPY src /usr/app/src

COPY node_modules /usr/app/node_modules

COPY tests /usr/app/tests

WORKDIR /usr/app


FROM exilesprx/blockchain:source AS version

COPY --from=exilesprx/blockchain:main /usr/app/package.json /usr/app/

COPY --from=exilesprx/blockchain:main /usr/app/pnpm-lock.yaml /usr/app

COPY --from=exilesprx/blockchain:main /usr/app/src /usr/app/src

COPY --from=exilesprx/blockchain:main /usr/app/node_modules /usr/app/node_modules

COPY nodemon.json /usr/app/

COPY tsconfig.json /usr/app/

WORKDIR /usr/app

RUN chown -R node. .

CMD [ "node" ]