# Blockchain

[![Build actions](https://github.com/exilesprx/blockchain/actions/workflows/build.yml/badge.svg)](https://github.com/exilesprx/blockchain/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/exilesprx/blockchain/branch/main/graph/badge.svg?token=LDLR0MVT0Z)](https://codecov.io/gh/exilesprx/blockchain)

This blockchain is for educational purposes only and should not be used for production purposes in its current state. As the application matures and meets standards, then at that point it can be used for production purposes.

## Prerequisites

- Node.js >= 24
- pnpm
- docker compose

## Getting Started

```bash
git clone https://github.com/exilesprx/blockchain.git
cd blockchain
pnpm install
```

To create the kafka topics, run the following command:

```bash
pnpm run setup:topics
```

To run the bank or miner locally, build first then start:

```bash
pnpm build
pnpm app:bank
pnpm app:miner
```

For fast local iteration without a build step, use the debug scripts:

```bash
pnpm debug:bank
pnpm debug:miner
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

| Script                 | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `pnpm build`           | Compile all packages (common → bank → miner)               |
| `pnpm test`            | Run all tests                                              |
| `pnpm test:watch`      | Run tests in watch mode                                    |
| `pnpm test:ui`         | Open the Vitest UI                                         |
| `pnpm lint`            | Lint source files with oxlint                              |
| `pnpm lint:fix`        | Lint and auto-fix                                          |
| `pnpm fmt`             | Check formatting with oxfmt                                |
| `pnpm fmt:fix`         | Auto-format source files                                   |
| `pnpm typecheck:bank`  | Type-check the bank package                                |
| `pnpm typecheck:miner` | Type-check the miner package                               |
| `pnpm debug:bank`      | Start the bank via tsx against source with Node inspector  |
| `pnpm debug:miner`     | Start the miner via tsx against source with Node inspector |
| `pnpm serve:bank`      | Start the bank via tsx against source (no inspector)       |
| `pnpm serve:miner`     | Start the miner via tsx against source (no inspector)      |

## Testing

[Vitest](https://vitest.dev) is the test runner. Tests run directly against TypeScript source files — no build step required. Vitest uses esbuild internally for transforms and respects the workspace `tsconfig.json` for path alias resolution.

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

## Build

All packages are compiled using [tsup](https://tsup.egoist.dev) (esbuild-based). Run from the workspace root:

```bash
pnpm build
```

This compiles packages in order:

1. **`bank`** — compiled as a single bundled ESM file to `dist/server.js`
2. **`miner`** — compiled as a single bundled ESM file to `dist/index.js`

`bank` and `miner` bundle all dependencies including `@blockchain/common` into a single self-contained file. The only runtime requirement is Node.js — no `node_modules` directory is needed in production.

It is also possible to compile `common` as an unbundled library with type declarations, which is useful for development and testing. This produces ESM output in `dist/` with accompanying `.d.ts` files, but does not bundle dependencies or produce a single file:

1. **`common`** — compiled as unbundled ESM with `.d.ts` type declarations to `dist/`

Type checking is separate from compilation. Run `tsc` via the typecheck scripts to catch type errors — tsup strips types without checking them:

```bash
pnpm typecheck:bank
pnpm typecheck:miner
```

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
4. If the package needs to be built (i.e. it is consumed by other packages or deployed as a service), add `packages/<name>/tsup.config.ts` and a `build` script to its `package.json`. See `packages/miner/tsup.config.ts` as a reference for a bundled service, or `packages/common/tsup.config.ts` for an unbundled library.
5. Create `packages/<name>/src/`
6. Run `pnpm install` from the workspace root

## Docker

Images for this project can be found: https://hub.docker.com/r/exilesprx/blockchain

### Stages

- `source` — base Node image (`node:25.8.2-bookworm-slim`)
- `base` — sets `NODE_ENV`, user, and working directory
- `pnpm` — installs pnpm
- `dev` — full install of all dependencies (used for local development and CI)
- `build` - compiles bank and miner packages via `pnpm build` (used for production builds)
- `bank` — production image for the bank app
- `miner` — production image for the miner app

### Run

Production images run compiled JavaScript directly via `node`. No TypeScript tooling or `node_modules` directory is required in the production image — all dependencies are bundled into a single file at build time.

### Building images

Use `docker-compose.version.yml` to build versioned images for bank and miner:

```bash
VERSION=1.0.0 docker compose -f docker-compose.version.yml build
```

This produces:

- `exilesprx/blockchain:bank-1.0.0`
- `exilesprx/blockchain:miner-1.0.0`
