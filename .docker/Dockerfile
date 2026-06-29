FROM node:26.4.0-bookworm-slim AS source
FROM source AS base
ENV NODE_ENV=development
ENV PATH="/home/node/.local/share/pnpm/bin:$PATH"
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


FROM base AS dev
ENV CI=true
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm /home/node/.local/share/pnpm
COPY --chmod=755 --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml /usr/app/
COPY --chmod=755 --chown=node:node packages/bank/package.json /usr/app/packages/bank/
COPY --chmod=755 --chown=node:node packages/miner/package.json /usr/app/packages/miner/
COPY --chmod=755 --chown=node:node packages/common/package.json /usr/app/packages/common/
RUN pnpm install --frozen-lockfile
COPY --chmod=755 --chown=node:node . /usr/app/


FROM base AS install
ENV CI=true
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm /home/node/.local/share/pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml /usr/app/
COPY --chmod=755 --chown=node:node . /usr/app/
RUN pnpm fetch \
  && pnpm install -r --offline


FROM base AS build
ENV CI=true
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chmod=755 --chown=node:node --from=install /usr/app/node_modules /usr/app/node_modules
COPY --chmod=755 --chown=node:node --from=install /usr/app/packages/bank/node_modules /usr/app/packages/bank/node_modules
COPY --chmod=755 --chown=node:node --from=install /usr/app/packages/miner/node_modules /usr/app/packages/miner/node_modules
COPY --chmod=755 --chown=node:node --from=install /usr/app/packages/common/node_modules /usr/app/packages/common/node_modules
COPY --chmod=755 --chown=node:node . /usr/app/
RUN pnpm run build \
  && pnpm --filter @blockchain/bank deploy --prod /usr/app/deploy/bank \
  && pnpm --filter @blockchain/miner deploy --prod /usr/app/deploy/miner


FROM base AS bank
ENV NODE_ENV=production
COPY --chmod=755 --chown=node:node --from=build /usr/app/deploy/bank/ /usr/app/
ENTRYPOINT ["node", "/usr/app/dist/server.js"]


FROM base AS miner
ENV NODE_ENV=production
COPY --chmod=755 --chown=node:node --from=build /usr/app/deploy/miner/ /usr/app/
ENTRYPOINT ["node", "/usr/app/dist/index.js"]
