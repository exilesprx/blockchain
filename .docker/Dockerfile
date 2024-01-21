FROM node:21.5.0-bookworm-slim AS source

RUN corepack enable \
  && corepack prepare pnpm@8.14.1 --activate
WORKDIR /usr/app
USER node

FROM exilesprx/blockchain:source AS main

COPY --chown=node:node --chmod=555 package.json /usr/app/
COPY --chown=node:node --chmod=555 pnpm-lock.yaml /usr/app/
COPY --chown=node:node --chmod=555 babel.config.js /usr/app/
COPY --chown=node:node --chmod=555 jest.config.ts /usr/app/
COPY --chown=node:node --chmod=555 src /usr/app/src
COPY --chown=node:node --chmod=555 node_modules /usr/app/node_modules
COPY --chown=node:node --chmod=555 tests /usr/app/tests


FROM exilesprx/blockchain:source AS version

COPY --chown=node:node --chmod=555 --from=exilesprx/blockchain:main /usr/app/package.json /usr/app/
COPY --chown=node:node --chmod=555 --from=exilesprx/blockchain:main /usr/app/pnpm-lock.yaml /usr/app
COPY --chown=node:node --chmod=555 --from=exilesprx/blockchain:main /usr/app/src /usr/app/src
COPY --chown=node:node --chmod=555 --from=exilesprx/blockchain:main /usr/app/node_modules /usr/app/node_modules
COPY --chown=node:node --chmod=555 nodemon.json /usr/app/
COPY --chown=node:node --chmod=555 tsconfig.json /usr/app/
CMD [ "node" ]