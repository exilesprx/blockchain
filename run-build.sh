#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo -e "\033[35m Updating app image blockchain:${BRANCH} \033[0m"
DOCKER_BUILDKIT=1 docker build -f .docker/Dockerfile --target build -t blockchain:${BRANCH} .

echo -e "\033[33m Running build:bank... \033[0m"
DOCKER_BUILDKIT=1 docker run -it blockchain:${BRANCH} npm run build:bank

echo -e "\033[33m Running build:miner... \033[0m"
DOCKER_BUILDKIT=1 docker run -it blockchain:${BRANCH} npm run build:miner

echo -e "\033[32m Done! \033[0m"