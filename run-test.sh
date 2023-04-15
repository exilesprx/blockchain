#! /bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo -e "\033[35m Updating test image blockchain-tests:${BRANCH} \033[0m"
DOCKER_BUILDKIT=1 docker build -f .docker/Dockerfile --target dev -t blockchain-tests:${BRANCH} .

echo -e "\033[33m Running tests... \033[0m"
DOCKER_BUILDKIT=1 docker run -it blockchain-tests:${BRANCH} npm run test

echo -e "\033[32m Done! \033[0m"