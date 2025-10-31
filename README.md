# Blockchain

[![Build actions](https://github.com/exilesprx/blockchain/actions/workflows/build.yml/badge.svg)](https://github.com/exilesprx/blockchain/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/exilesprx/blockchain/branch/main/graph/badge.svg?token=LDLR0MVT0Z)](https://codecov.io/gh/exilesprx/blockchain)

This blockchain is for educational purposes only and should not be used for production purposes in its current state. As the application matures and meets standards, then at that point it can be used for production purposes.

## Docker

Images for this project can be found: https://hub.docker.com/r/exilesprx/blockchain

### Stages

- source: the image all other stages are built upon
- base: the stage that contains the very basic configurations for all other stages. Ex: user, working directory
- pnpm: the stage that installs pnpm. Pnpm can be copied from this stage to other images if needed
- install: the stage that installs all dependencies for the application. Dependencies can be copied from this stage to other stages if needed
- compile: the stage that prepares the source code for distribution (ex: test and build)
- main: the stage that contains the source code and tools necessary for tasks such as linting, auditing, building, and/or testing
- version: the stage that contains the built source code for a specific version/release. Should never contain development tools

Helper scripts:

- run-build
  - this will build an image containing the source files
  - tag using the current branch name
  - build the bank and miner to ensure no JavaScript issues
- run-test
  - this will build a test image with containing the source files
  - tag using the current branch name
  - runs the tests

### Run

- nodemon uses ts-node to run typescript removing the extra step of compiling the code before running
- the build command exists to ensure no errors will present themselves upon run time, so its important to "compile" the source code at some point

### Compilation

TypeScript is used for the source code of the application. The source code is then "compiled" into raw JavaScript and placed in the "build" folder. - commands: - build:miner - build:bank

See: tsconfig.json

### Jest

Jest is used to test the applicaiton code. However, Babel is required in order to support TypeScript when testing the source code.

## Debugging

Using ts-node allows us to remove compilation of TypeScript files. So we can setup our directories to match.

```JSON
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Blockchain",
            "type": "node",
            "request": "attach",
            "restart": true,
            "port": 9229,
            "address": "endeavour",
            "localRoot": "${workspaceFolder}/src",
            "remoteRoot": "/usr/app/src",
            "protocol": "inspector",
            "sourceMaps": true,
          }
    ]
}
```

### TODO

- Database
  - ~~use eventstoreDB~~
  - ~~persist transactions submitted (from API)~~
  - persist transactiosn verified (from auditor)
  - ~~persist mined blocks (from miner)~~
- App
  - Transactions
    - ~~added to a pool via API~~
    - ~~broadcasts event "transaction added"~~
  - Blockchain
    - ~~add mined block to chain from stream~~
    - ~~note: this chain is only present to add another node for a consensus check~~
- Miner
  - Transactions
    - ~~added to a pool via stream~~
    - ~~determine if we should create a block~~
      - ~~to start use arbitrary rule of "block count > 20"~~
    - ~~if yes, create a block and mine~~
  - Blockchain
    - ~~broadcast event "block mined"~~
    - ~~add the mined block to the chain from stream~~
    - ~~if previous block hash doesn't match, then a block proceeded it, so throw it out (we're using a stream with guaranteed ordering)~~
    - ~~broadcast event "block added"~~
    - implement consensus model
- Logger
  - ~~treat as a feature~~
  - ~~add graylog~~
  - ~~add winston gelf~~
  - ~~wrap logger in support class~~
- Auditor
  - Transactions
    - compare "generated transactions" vesus "processed transactions"
    - should "rebroadcast" so they're appended to the chain
    - happens every X seconds/minutes
- Restoration
  - Application
    - grab the last few block events
    - restore the chain with the blocks pulled
  - Miner
- End to end testing
  - Scheduler
    - Produces transactions every X seconds (start with manual entry at first)
- Process
  - ~~update to use nodemon~~
  - ~~update to use ts-node~~
  - ~~update to use npm app and npm app:debug~~
  - ~~remove ts building in container image~~
  - ~~use docker cp or rebuild image to run new changes~~
  - ~~transition to github actions~~
- Tests
  - ~~update the tests to match all the changes made~~
  - ~~add code coverage~~
  - increase code coverage with meaningful tests
- Notes
  - Consumers/miners
    - MULTIPLE CONSUMERS MUST BE ON DIFFERENT GROUPS
  - Transactions dropped
    - if a transaction is never added to a block, how do we find the transaction? And how do we rebroadcast it?
  - Miner
    - if block mined event is received, so if its currently mining, if so, stop it, and start mining a new block (if reqs are met)
  - Docker build
    - ~~clean up the build process~~
    - ~~targets for container builds~~
      - ~~source - foundation of image~~
      - ~~main - includes development source code from main~~
      - ~~version - includes production source code from main, tagged, and packaged for a release version~~
- Pipelines
  - ~~update feature.yml to build and use local docker containers because when/if the docker image changes, the code changes need to run against them~~
  - ~~update the build.yml to build the docker source image first and push, then the following steps can use the newly built and pushed images~~
