#!/bin/bash

echo -e "\033[35m Updating app image... \033[0m"
docker build -f .docker/app/Dockerfile -t blockchain:latest .