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
ENV PATH="/home/node/.local/share/pnpm:$PATH"
ENV CI=true
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chmod=755 --chown=node:node . /usr/app/
RUN pnpm install --frozen-lockfile


FROM base AS compile
ENV NODE_ENV=production
ENV PATH="/home/node/.local/share/pnpm:$PATH"
ENV CI=true
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chmod=755 --chown=node:node . /usr/app/
RUN pnpm install --frozen-lockfile \
  && pnpm run test \
  && pnpm run build:bank \
  && pnpm run build:miner


FROM base AS bank
ENV NODE_ENV=production
ENV PATH="/home/node/.local/share/pnpm:$PATH"
COPY --chown=node:node --chmod=755 --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chown=node:node --chmod=755 --from=install /usr/app/node_modules /usr/app/node_modules
RUN pnpm --filter @blockchain/bank deploy --prod /usr/app


FROM base AS miner
ENV NODE_ENV=production
ENV PATH="/home/node/.local/share/pnpm:$PATH"
COPY --chown=node:node --chmod=755 --from=pnpm /root/.local/share/pnpm/ /home/node/.local/share/pnpm/
COPY --chown=node:node --chmod=755 --from=install /usr/app/node_modules /usr/app/node_modules
RUN pnpm --filter @blockchain/miner deploy --prod /usr/app
