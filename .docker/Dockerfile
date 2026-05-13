FROM node:26.1.0-bookworm-slim AS source
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
ENV PATH="/home/node/.local/share/pnpm/bin:$PATH"
ENV CI=true
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chmod=755 --chown=node:node . /usr/app/
RUN pnpm install --frozen-lockfile


FROM base AS install
ENV PATH="/home/node/.local/share/pnpm/bin:$PATH"
ENV CI=true
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chmod=755 --chown=node:node . /usr/app/
RUN pnpm install --frozen-lockfile


FROM base AS build
ENV PATH="/home/node/.local/share/pnpm/bin:$PATH"
ENV CI=true
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chmod=755 --chown=node:node . /usr/app/
COPY --chmod=755 --chown=node:node --from=install /usr/app/node_modules /usr/app/node_modules
COPY --chmod=755 --chown=node:node --from=install /usr/app/packages/bank/node_modules /usr/app/packages/bank/node_modules
COPY --chmod=755 --chown=node:node --from=install /usr/app/packages/miner/node_modules /usr/app/packages/miner/node_modules
COPY --chmod=755 --chown=node:node --from=install /usr/app/packages/common/node_modules /usr/app/packages/common/node_modules
RUN pnpm run build


FROM base AS bank
ENV NODE_ENV=production
ENV PATH="/home/node/.local/share/pnpm/bin:$PATH"
ENV CI=true
COPY --chmod=755 --chown=node:node --from=build /usr/app/packages/bank/dist/ /usr/app/
ENTRYPOINT ["node", "/usr/app/server.js"]


FROM base AS miner
ENV NODE_ENV=production
ENV PATH="/home/node/.local/share/pnpm/bin:$PATH"
ENV CI=true
COPY --chmod=755 --chown=node:node --from=build /usr/app/packages/miner/dist/ /usr/app/
ENTRYPOINT ["node", "/usr/app/index.js"]
