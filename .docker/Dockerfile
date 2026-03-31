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


FROM base AS dev
ENV NODE_ENV=production
ENV PATH="/home/node/.local/share/pnpm:$PATH"
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chmod=755 --chown=node:node . /usr/app/
RUN pnpm install --frozen-lockfile


FROM base AS install
ENV PATH="/home/node/.local/share/pnpm:$PATH"
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chmod=644 --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml /usr/app/
COPY --chmod=644 --chown=node:node packages/common/package.json /usr/app/packages/common/
COPY --chmod=644 --chown=node:node packages/bank/package.json /usr/app/packages/bank/
COPY --chmod=644 --chown=node:node packages/miner/package.json /usr/app/packages/miner/
RUN pnpm install --frozen-lockfile --prod


FROM base AS bank
ENV NODE_ENV=production
ENV PATH="/home/node/.local/share/pnpm:$PATH"
COPY --chown=node:node --chmod=755 --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chown=node:node --chmod=555 package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json /usr/app/
COPY --chown=node:node --chmod=555 packages/common/package.json packages/common/tsconfig.json /usr/app/packages/common/
COPY --chown=node:node --chmod=555 packages/bank/package.json packages/bank/tsconfig.json /usr/app/packages/bank/
COPY --chown=node:node --chmod=555 packages/common/src /usr/app/packages/common/src
COPY --chown=node:node --chmod=555 packages/bank/src /usr/app/packages/bank/src
COPY --chown=node:node --chmod=755 --from=install /usr/app/node_modules /usr/app/node_modules


FROM base AS miner
ENV NODE_ENV=production
ENV PATH="/home/node/.local/share/pnpm:$PATH"
COPY --chown=node:node --chmod=755 --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chown=node:node --chmod=555 package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json /usr/app/
COPY --chown=node:node --chmod=555 packages/common/package.json packages/common/tsconfig.json /usr/app/packages/common/
COPY --chown=node:node --chmod=555 packages/miner/package.json packages/miner/tsconfig.json /usr/app/packages/miner/
COPY --chown=node:node --chmod=555 packages/common/src /usr/app/packages/common/src
COPY --chown=node:node --chmod=555 packages/miner/src /usr/app/packages/miner/src
COPY --chown=node:node --chmod=755 --from=install /usr/app/node_modules /usr/app/node_modules
