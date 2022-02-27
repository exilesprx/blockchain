# Blockchain

[![CircleCI](https://circleci.com/gh/exilesprx/blockchain/tree/main.svg?style=svg)](https://circleci.com/gh/exilesprx/blockchain/tree/main)

This blockchain is for educational purposes only and should not be used for production purposes in its current state. As the application matures and meets standards, then at that point it can be used for production purposes.

### Compilation

TypeScript is used for the source code of the application. The source code is then "compiled" into raw JavaScript and placed in the "build" folder.

See: tsconfig.json

### Jest

Jest is used to test the applicaiton code. However, Babel is required in order to support TypeScript when testing the source code.

### TODO
- Bank
    - Transactions
        - added to a pool via API
        - broadcasts event "transaction added"
    - Blockchain
        - add mined block to chain from stream
        - this chain it only present to add another node for a consensus check
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
        - broadcast event "block added"
        - persist the block to eventstoreDB
- End to end testing
    - Scheduler
        - Produces transactions every X secones (start with manual entry at first)
- Notes 
    - Consumers/miners
        - MULTIPLE CONSUMERS MUST BE ON THE SAME GROUP TO MINE THE SAME PARTITION