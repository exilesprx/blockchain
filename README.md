# Blockchain

[![Build actions](https://github.com/exilesprx/blockchain/actions/workflows/build.yml/badge.svg)](https://github.com/exilesprx/blockchain/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/exilesprx/blockchain/branch/main/graph/badge.svg?token=LDLR0MVT0Z)](https://codecov.io/gh/exilesprx/blockchain)

This blockchain is for educational purposes only and should not be used for production purposes in its current state. As the application matures and meets standards, then at that point it can be used for production purposes.

## Prerequisites

- Node.js 25.8.1
- pnpm 10.32.1

## Getting Started

```bash
git clone https://github.com/exilesprx/blockchain.git
cd blockchain
pnpm install
```

To run the bank or miner locally:

```bash
pnpm app:bank
pnpm app:miner
```

## Workspace Structure

This is a pnpm monorepo containing three packages:

```
packages/
  common/    @blockchain/common    shared domain logic, infrastructure, and events
  bank/      @blockchain/bank      HTTP API for submitting transactions
  miner/     @blockchain/miner     Kafka consumer that mines blocks
```

## Scripts

Run all scripts from the workspace root.

| Script                 | Description                             |
| ---------------------- | --------------------------------------- |
| `pnpm test`            | Run all tests                           |
| `pnpm test:watch`      | Run tests in watch mode                 |
| `pnpm test:ui`         | Open the Vitest UI                      |
| `pnpm lint`            | Lint source files with oxlint           |
| `pnpm lint:fix`        | Lint and auto-fix                       |
| `pnpm fmt`             | Check formatting with oxfmt             |
| `pnpm fmt:fix`         | Auto-format source files                |
| `pnpm app:bank`        | Start the bank server                   |
| `pnpm app:miner`       | Start the miner                         |
| `pnpm typecheck:bank`  | Type-check the bank package             |
| `pnpm typecheck:miner` | Type-check the miner package            |
| `pnpm debug:bank`      | Start the bank with the Node inspector  |
| `pnpm debug:miner`     | Start the miner with the Node inspector |

## Testing

[Vitest](https://vitest.dev) is the test runner. No compilation step is required — tests run directly against the TypeScript source via `tsx`.

Coverage is provided by `@vitest/coverage-v8`.

```bash
pnpm test          # run once
pnpm test:watch    # watch mode
pnpm test:ui       # browser UI
```

To run tests for a single package:

```bash
pnpm --filter @blockchain/common test
pnpm --filter @blockchain/bank test
pnpm --filter @blockchain/miner test
```

## Compilation

There is no compilation step. The apps run TypeScript source directly at runtime via `tsx`.

`typecheck:bank` and `typecheck:miner` run type-checking only (`tsc --noEmit`) — no JavaScript output is produced. These are used in CI to catch type errors before deployment.

## Common Workflows

**Add a dependency to a specific package:**

```bash
pnpm --filter @blockchain/bank add <package>
pnpm --filter @blockchain/common add <package>
```

**Add a dev dependency to the workspace root:**

```bash
pnpm add -D <package> -w
```

**Run a script in a specific package:**

```bash
pnpm --filter @blockchain/bank <script>
```

## Adding a Package

1. Create the directory: `packages/<name>/`
2. Add `packages/<name>/package.json`:
   ```json
   {
     "name": "@blockchain/<name>",
     "version": "0.1.0",
     "type": "module",
     "scripts": {}
   }
   ```
3. Add `packages/<name>/tsconfig.json`:
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "noEmit": true,
       "paths": {
         "@/*": ["./src/*"]
       }
     },
     "include": ["src/**/*"]
   }
   ```
4. Create `packages/<name>/src/`
5. Run `pnpm install` from the workspace root

## Docker

Images for this project can be found: https://hub.docker.com/r/exilesprx/blockchain

### Stages

- `source` — base Node image (`node:25.8.2-bookworm-slim`)
- `base` — sets `NODE_ENV`, user, and working directory
- `pnpm` — installs pnpm
- `dev` — full install of all dependencies (used for local development and CI)
- `bank` — production image for the bank app
- `miner` — production image for the miner app

### Run

Apps run TypeScript source directly at runtime via `tsx`. No compilation to JavaScript is required.

### Building images

Use `docker-compose.version.yml` to build versioned images for bank and miner:

```bash
VERSION=1.0.0 docker compose -f docker-compose.version.yml build
```

This produces:

- `exilesprx/blockchain:bank-1.0.0`
- `exilesprx/blockchain:miner-1.0.0`
