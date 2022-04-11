#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo -e "\033[35m Updating app image... \033[0m"
docker build -f .docker/app/Dockerfile -t blockchain:${BRANCH} .

echo -e "\033[33m Running build:app... \033[0m"
docker run -it blockchain:${BRANCH} npm run build:app

echo -e "\033[32m Done! \033[0m"