# Workspace Migration Plan

## Goal

Migrate a TypeScript blockchain monorepo from a single `src/` directory structure to pnpm workspaces with 3 separate packages, then fix Docker build permission issues.

## Migration Requirements

### Initial Structure

- Use pnpm workspaces with 3 packages: `@blockchain/common`, `@blockchain/bank`, `@blockchain/miner`
- Perform all migration at once (low risk approach acceptable)
- Keep Docker files shared (Dockerfile stays as-is, only paths updated)
- Place common code directly in `packages/common/src/` (no nested `shared/` directory)
- Keep tests at the root level initially
- Use current tsx runtime approach (no compiled outputs needed)
- Allow bank/miner to import from subdirectories in common for granular imports
- Set workspace package versions to 0.1.0
- Import paths should NOT include `/src/` in them (e.g., `@blockchain/common/domain/chain/blockchain`)

### Test Organization

- Move tests into workspace packages to avoid dependency version mismatches
- Organize by domain/feature: domain/infrastructure tests → common, bank-specific tests → bank
- Each workspace manages its own test dependencies

### Path Alias Pattern

- Use `@/` alias within each package pointing to `./src`
- Tests use `@/domain/...` instead of `../src/domain/...`
- Keep workspace aliases (`@blockchain/common/*`) for cross-package imports

## Discoveries

### Project Tooling

- Uses oxlint (not ESLint), oxfmt (not Prettier), Vitest (not Jest)
- Uses pnpm 10.32.1
- Node.js 25+ does NOT include Corepack anymore (it's opt-in)
- Using TypeScript with `module: "ESNext"` and `moduleResolution: "bundler"`

### ESM Requirements

- Relative imports within packages need `.js` file extensions for ESM compatibility
- crypto-js requires default import: `import CryptoJS from 'crypto-js'` then use `CryptoJS.SHA256()`
- Files in `packages/common/src/commands/`, `events/`, `translators/` are siblings to `domain/` and `infrastructure/`, so they use `../domain/...` not `../../domain/...`

### Vitest 4 Changes

- Use `test.projects` instead of deprecated `test.workspace`
- Workspace configuration: root config defines projects array pointing to package directories
- Each package has its own `vitest.config.ts` with package-specific aliases

### Docker/pnpm Installation

- The pnpm binary at `/root/.local/share/pnpm/pnpm` is a shell script wrapper
- It calls the real executable at `/root/.local/share/pnpm/.tools/pnpm-exe/10.32.1/pnpm`
- Must copy entire `/root/.local/share/pnpm/` directory structure, not just the binary
- Destination should be `/home/node/.local/share/pnpm/` (user's home directory)
- Add `/home/node/.local/share/pnpm` to PATH with `ENV PATH="/home/node/.local/share/pnpm:$PATH"`

### Docker Permission Issues

- Getting `EACCES: permission denied, mkdir '/usr/app/packages/bank/node_modules'` when running `pnpm install`
- The `install` stage runs as `USER node` (from base stage)
- Files are copied with `--chown=node:node` but some have `--chmod=555` (read-only)
- The `/usr/app/packages/*/` directories need write permissions for pnpm to create `node_modules/`
- Issue: package.json files copied with `--chmod=555` makes directories read-only, preventing `node_modules/` creation
- Solution: Use `--chmod=644` for package.json files (read+write for owner)

## Accomplished Tasks

### ✅ Workspace Migration Complete

1. Created workspace structure with 3 packages
2. Moved 51 TypeScript files to appropriate packages
3. Added `.js` extensions to 111+ relative imports for ESM
4. Fixed import path levels (changed `../../` to `../` for sibling directories)
5. Updated 38+ imports in bank/miner from relative to workspace aliases
6. Fixed crypto-js import for ESM compatibility
7. Updated all `vi.mock()` paths from relative to workspace aliases
8. Deleted old `src/` directory

### ✅ Test Organization Complete

1. Moved 17 tests to `packages/common/tests/`
2. Moved 3 tests to `packages/bank/tests/`
3. Moved builders and stubs to `packages/common/tests/`
4. Added test devDependencies to workspace packages (vitest, @faker-js/faker)
5. Removed duplicated dependencies from root package.json
6. Created workspace-specific vitest configs
7. Updated root vitest config to use `test.projects` (Vitest 4 format)

### ✅ Path Aliases Complete

1. Added `@/*` alias to both workspace tsconfigs pointing to `./src`
2. Updated 50 import statements in tests to use `@/` alias
3. Both workspace tsconfigs include `tests/**/*` in includes
4. Each workspace vitest config has `@/` alias configured

### ✅ Docker Build Fixed

1. Fixed permission issue by using `--chmod=644` for package.json files
2. Created separate `bank` and `miner` build stages for isolated images
3. Bank image contains only common + bank packages
4. Miner image contains only common + miner packages
5. Each uses optimized production-only dependencies

### ✅ All 76 Tests Passing (100%)

## Workspace Structure

```
blockchain/
├── pnpm-workspace.yaml          # Workspace config: packages: ['packages/*']
├── package.json                 # Root with scripts and shared dev tooling
├── tsconfig.json               # Root config with path mappings for all 3 workspaces
├── vitest.config.ts            # Root config: test.projects: ['packages/common', 'packages/bank']
├── packages/
│   ├── common/                 # Shared domain, infrastructure, commands, events
│   │   ├── package.json       # Dependencies: uuid, kafkajs, crypto-js, etc.
│   │   ├── tsconfig.json      # Config with @/* and @blockchain/common/* aliases
│   │   ├── vitest.config.ts   # Test config with @/ alias and coverage
│   │   ├── src/               # Source code
│   │   └── tests/             # 17 tests
│   ├── bank/                  # Bank API backend
│   │   ├── package.json       # Dependencies: h3, listhen, @blockchain/common workspace
│   │   ├── tsconfig.json      # Config with @/* alias
│   │   ├── vitest.config.ts   # Test config with @/ alias and coverage
│   │   ├── src/               # Source code
│   │   └── tests/             # 3 tests
│   └── miner/                 # Miner node application
│       ├── package.json       # Dependencies: tsx, @blockchain/common workspace
│       ├── tsconfig.json      # Config with @/* alias
│       └── src/               # Source code
├── .docker/
│   └── Dockerfile             # Multi-stage build with separate bank/miner stages
└── docker-compose.yml          # Updated command paths to packages/*/src/

```

## Docker Build Stages

### Original Plan (Multi-stage with pnpm deploy)

1. **`source`**: Base Node.js 25.8.1 image
2. **`base`**: Sets up node user and working directory
3. **`pnpm`**: Downloads and installs pnpm
4. **`install`**: Installs all production dependencies (shared)
5. **`install-bank`**: Uses `pnpm deploy` to create isolated bank deployment
6. **`install-miner`**: Uses `pnpm deploy` to create isolated miner deployment
7. **`compile`**: Test and build stage (for CI/CD)
8. **`main`**: Full monorepo image (all packages)
9. **`bank`**: Bank-only image with optimized dependencies
10. **`miner`**: Miner-only image with optimized dependencies

### Key Docker Build Commands

```bash
# Build bank image
docker build -f .docker/Dockerfile --target bank -t blockchain-bank .

# Build miner image
docker build -f .docker/Dockerfile --target miner -t blockchain-miner .

# Build both in parallel
docker build -f .docker/Dockerfile --target bank -t blockchain-bank . && \
docker build -f .docker/Dockerfile --target miner -t blockchain-miner .
```

## Final Results

- **Workspace packages**: 3 (common, bank, miner)
- **Source files migrated**: 51
- **Tests migrated**: 20
- **Import statements updated**: 111+ with .js extensions, 38+ to workspace aliases
- **All tests passing**: 76/76 (100%)
- **Docker images**: Separate optimized images for bank and miner
- **Bank image size**: ~295-347MB (depending on optimization level)
- **Miner image size**: ~295-338MB (depending on optimization level)
- **Package isolation**: ✅ Bank doesn't contain miner code, miner doesn't contain bank code

## Technical Notes

### ESM Import Patterns

```typescript
// ✅ Correct: Relative imports with .js extension
import { Block } from '../domain/chain/block.js';

// ✅ Correct: Workspace imports (no .js needed)
import { Block } from '@blockchain/common/domain/chain/block';

// ✅ Correct: Intra-package alias imports (no .js needed)
import { Block } from '@/domain/chain/block';

// ❌ Wrong: Relative import without .js
import { Block } from '../domain/chain/block';
```

### pnpm Deploy Command

```bash
# Modern pnpm v10 deploy (requires workspace configuration or --legacy flag)
pnpm --filter @blockchain/bank deploy --prod /output/path

# Legacy deploy (works without additional config)
pnpm --filter @blockchain/bank deploy --prod --legacy /output/path
```

### Vitest Configuration Hierarchy

1. **Root**: `vitest.config.ts` with `test.projects` pointing to packages
2. **Package**: Each package has its own `vitest.config.ts` with:
   - Package-specific path aliases (`@/` → `./src`)
   - Coverage configuration
   - Test file patterns

## Lessons Learned

1. **pnpm workspaces require careful planning**: The filter command needs actual package structures, not just package.json files
2. **ESM is strict about file extensions**: Relative imports must include .js extensions
3. **Docker permissions matter**: Read-only directories prevent pnpm from creating node_modules
4. **pnpm deploy is powerful**: Creates isolated deployments with only necessary dependencies
5. **Vitest 4 changed workspace config**: Use `test.projects` instead of deprecated `test.workspace`
6. **Corepack is opt-in in Node 25+**: Must install pnpm explicitly in Docker
7. **crypto-js needs default import for ESM**: Cannot use named imports
8. **CI environment variable affects pnpm behavior**: Set carefully or use alternative approaches

## Next Steps (If Needed)

- [ ] Configure `.pnpmrc` to enable `inject-workspace-packages=true` to avoid --legacy flag
- [ ] Add health checks to Docker images
- [ ] Optimize Docker layer caching further
- [ ] Consider adding separate test stages for each package in CI
- [ ] Document workspace dependency update workflow
- [ ] Add workspace-specific linting configurations if needed
