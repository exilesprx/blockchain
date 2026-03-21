FROM node:25.8.2-bookworm-slim AS source
FROM source AS base
ENV NODE_ENV=development
USER node
WORKDIR /usr/app


FROM source AS pnpm
RUN apt-get -y update \
  && apt-get -y install --no-install-recommends \
  wget \
  ca-certificates \
  && apt-get -y clean \
  && rm -rf /var/lib/apt/lists/*
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -


FROM base AS install
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm /usr/local/bin/
COPY --chmod=555 --chown=node:node package.json /usr/app/
COPY --chmod=555 --chown=node:node pnpm-lock.yaml /usr/app/
COPY --chmod=555 --chown=node:node pnpm-workspace.yaml /usr/app/
COPY --chmod=555 --chown=node:node packages/common/package.json /usr/app/packages/common/
COPY --chmod=555 --chown=node:node packages/bank/package.json /usr/app/packages/bank/
COPY --chmod=555 --chown=node:node packages/miner/package.json /usr/app/packages/miner/
RUN pnpm install --frozen-lockfile


FROM base AS compile
ENV NODE_ENV=production
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm /usr/local/bin/
COPY --from=install --chmod=755 --chown=node:node /usr/app/node_modules/ /usr/app/node_modules/
COPY --chmod=755 --chown=node:node . /usr/app/
RUN pnpm run test \
  && pnpm run build:bank \
  && pnpm run build:miner


FROM base AS main
ENV NODE_ENV=production
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm /usr/local/bin/
COPY --chown=node:node --chmod=555 package.json /usr/app/
COPY --chown=node:node --chmod=555 pnpm-lock.yaml /usr/app/
COPY --chown=node:node --chmod=555 pnpm-workspace.yaml /usr/app/
COPY --chown=node:node --chmod=555 tsconfig.json /usr/app/
COPY --chown=node:node --chmod=555 packages/common/package.json /usr/app/packages/common/
COPY --chown=node:node --chmod=555 packages/bank/package.json /usr/app/packages/bank/
COPY --chown=node:node --chmod=555 packages/miner/package.json /usr/app/packages/miner/
COPY --chown=node:node --chmod=555 packages/common/tsconfig.json /usr/app/packages/common/
COPY --chown=node:node --chmod=555 packages/bank/tsconfig.json /usr/app/packages/bank/
COPY --chown=node:node --chmod=555 packages/miner/tsconfig.json /usr/app/packages/miner/
COPY --chown=node:node --chmod=555 packages /usr/app/packages
COPY --chown=node:node --chmod=755 --from=install /usr/app/node_modules /usr/app/node_modules
COPY --chown=node:node --chmod=555 vitest.config.ts /usr/app/
COPY --chown=node:node --chmod=555 tests /usr/app/tests
COPY --chown=node:node --chmod=555 .oxlintrc.json /usr/app/
COPY --chown=node:node --chmod=555 .oxfmtrc.json /usr/app/
COPY --chown=node:node --chmod=555 .gitignore /usr/app/

FROM base AS version
ENV NODE_ENV=production
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm /usr/local/bin/
COPY --chown=node:node --chmod=555 package.json /usr/app/
COPY --chown=node:node --chmod=555 pnpm-lock.yaml /usr/app/
COPY --chown=node:node --chmod=555 pnpm-workspace.yaml /usr/app/
COPY --chown=node:node --chmod=555 tsconfig.json /usr/app/
COPY --chown=node:node --chmod=555 packages/common/package.json /usr/app/packages/common/
COPY --chown=node:node --chmod=555 packages/bank/package.json /usr/app/packages/bank/
COPY --chown=node:node --chmod=555 packages/miner/package.json /usr/app/packages/miner/
COPY --chown=node:node --chmod=555 packages/common/tsconfig.json /usr/app/packages/common/
COPY --chown=node:node --chmod=555 packages/bank/tsconfig.json /usr/app/packages/bank/
COPY --chown=node:node --chmod=555 packages/miner/tsconfig.json /usr/app/packages/miner/
COPY --chown=node:node --chmod=555 packages /usr/app/packages
COPY --chown=node:node --chmod=755 --from=install /usr/app/node_modules /usr/app/node_modules
