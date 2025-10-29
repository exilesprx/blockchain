FROM node:25.0.0-bookworm-slim AS source
FROM source AS base
ENV NODE_ENV=development
WORKDIR /usr/app
USER node


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
RUN pnpm install --frozen-lockfile


FROM base AS prerelease
ENV NODE_ENV=production
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm /usr/local/bin/
COPY --from=install --chmod=755 --chown=node:node /usr/app/node_modules/ /usr/app/node_modules/
COPY --chmod=755 --chown=node:node . /usr/app/
RUN pnpm run build \
  && pnpm run test


FROM base AS main
ENV NODE_ENV=production
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm /usr/local/bin/
COPY --chown=node:node --chmod=555 package.json /usr/app/
COPY --chown=node:node --chmod=555 pnpm-lock.yaml /usr/app/
COPY --chown=node:node --chmod=555 pnpm-workspace.yaml /usr/app/
COPY --chown=node:node --chmod=555 tsconfig.json /usr/app/
COPY --chown=node:node --chmod=555 jest.config.ts /usr/app/
COPY --chown=node:node --chmod=555 src /usr/app/src
COPY --chown=node:node --chmod=555 --from=install node_modules /usr/app/node_modules
COPY --chown=node:node --chmod=555 tests /usr/app/tests


FROM base AS version
ENV NODE_ENV=production
COPY --chmod=755 --chown=node:node --from=pnpm /root/.local/share/pnpm /usr/local/bin/
COPY --chown=node:node --chmod=555 --from=main /usr/app/package.json /usr/app/
COPY --chown=node:node --chmod=555 --from=main /usr/app/pnpm-lock.yaml /usr/app
COPY --chown=node:node --chmod=555 --from=main pnpm-workspace.yaml /usr/app/
COPY --chown=node:node --chmod=555 --from=main /usr/app/src /usr/app/src
COPY --chown=node:node --chmod=555 --from=main /usr/app/node_modules /usr/app/node_modules
COPY --chown=node:node --chmod=555 tsconfig.json /usr/app/
