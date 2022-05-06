# Blockchain

[![CircleCI](https://circleci.com/gh/exilesprx/blockchain/tree/main.svg?style=svg)](https://circleci.com/gh/exilesprx/blockchain/tree/main) [![codecov](https://codecov.io/gh/exilesprx/blockchain/branch/main/graph/badge.svg?token=LDLR0MVT0Z)](https://codecov.io/gh/exilesprx/blockchain)

This blockchain is for educational purposes only and should not be used for production purposes in its current state. As the application matures and meets standards, then at that point it can be used for production purposes.

## Docker

Images for this project can be found: https://hub.docker.com/r/exilesprx/blockchain

Helper scripts:
- run-build
  - this will build an image with the current file state, tag using the current branch name, and build the app and miner
- run-test
  - this will build a test image with the current file state, tag using the current branch name, and runs the tests

### Compilation

TypeScript is used for the source code of the application. The source code is then "compiled" into raw JavaScript and placed in the "build" folder.

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
        - added to a pool via stream
        - determine if we should create a block
            - to start use arbitrary rule of "block count > 20"
        - if yes, create a block and mine
    - Blockchain
        - broadcast event "block mined"
        - add the mined block to the chain from stream
        - if previous block hash doesn't match, then a block proceeded it, so throw it
            out (we're using a stream with guaranteed ordering)
            - NOTE: censensus model - app uses DB/memory - miners use memory
            - would need to stop current mine process
        - broadcast event "block added"
        - persist the block to eventstoreDB
            - NOTE: not sure we need this since this would require machine to run this
- Auditor
    - Transactions
        - compares "generated transactions" vesus "processed transactions"
        - should "rebroadcast" so they're added to a chain
        - happens every X
- Restoration
    - Application
        - grab the last few block events
        - restore the chain with the blocks pulled
    - Miner
- End to end testing
    - Scheduler
        - Produces transactions every X secones (start with manual entry at first)
- Process
    - ~~update to use nodemon~~
    - ~~update to use ts-node~~
    - ~~update to use npm app and npm app:debug~~
    - ~~remove ts building in container image~~
    - ~~use docker cp or rebuild image to run new changes~~
    - ~~circleCI~~
        - ~~workflow~~
            - ~~build~~
            - ~~lint the project~~
            - ~~snyk~~
            - ~~run the tests~~
- Tests
    - ~~update the tests to match all the changes made~~
    - ~~add code coverage~~
    - increase code coverage with meaningful tests
- Notes 
    - Consumers/miners
        - MULTIPLE CONSUMERS MUST BE ON THE SAME GROUP TO MINE THE SAME PARTITION
    - Transactions dropped
        - if a transaction is never added to a block, how do we find the transaction? And how do we rebroadcast it?
    - Miner
        - if block mined event is received, so if its currently mining, if so, stop it, and start mining a new block (if reqs are met)
    - Docker build
        - ~~clean up the build process~~
        - container builds
            - dev (app and miner)
            - test
            - prod (app and miner)
