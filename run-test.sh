#! /bin/bash

echo -e "\033[35m Updating image... \033[0m"
docker build -f .docker/tests/Dockerfile -t blockchain-tests:latest .

echo -e "\033[33m Running tests... \033[0m"
docker run -it blockchain-tests:latest npm run test

echo -e "\033[32m Done! \033[0m"