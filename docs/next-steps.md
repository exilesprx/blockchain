# Next Steps

This document outlines potential improvements and next steps for the blockchain workspace project after completing the pnpm workspace migration.

## Immediate Priorities

### 1. Test Docker Images

**Status:** Not tested since final Option B implementation  
**Priority:** High

- [ ] Start Docker daemon
- [ ] Build bank image: `docker build -f .docker/Dockerfile --target bank -t blockchain-bank .`
- [ ] Build miner image: `docker build -f .docker/Dockerfile --target miner -t blockchain-miner .`
- [ ] Verify bank image structure: `docker run --rm blockchain-bank ls -la /usr/app/packages/`
- [ ] Verify miner image structure: `docker run --rm blockchain-miner ls -la /usr/app/packages/`
- [ ] Test running bank service with docker-compose
- [ ] Test running miner service with docker-compose
- [ ] Verify inter-service communication works

### 2. Update Documentation

**Status:** Partial - migration plan documented  
**Priority:** Medium

- [ ] Update main README.md with workspace structure
- [ ] Document how to run individual packages locally
- [ ] Add section on adding new workspace packages
- [ ] Document Docker build targets and usage
- [ ] Create developer onboarding guide for the workspace structure
- [ ] Add examples of common development workflows

### 3. Remove .pnpmrc if Not Needed

**Status:** Created but may not be necessary  
**Priority:** Low

- [ ] Verify if `.pnpmrc` with `dedupe-injected-deps=true` is needed
- [ ] Test builds without it
- [ ] Remove if not required for current setup

## Docker Optimizations

### 4. Optimize Docker Layer Caching

**Status:** Basic multi-stage setup complete  
**Priority:** Medium

- [ ] Analyze which layers change most frequently
- [ ] Consider separating common package source from bank/miner
- [ ] Add `.dockerignore` optimizations if needed
- [ ] Measure build times with and without cache

### 5. Add Docker Health Checks

**Status:** Not implemented  
**Priority:** Medium

```dockerfile
# Example for bank stage
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
```

- [ ] Add health check endpoint to bank service
- [ ] Add health check to bank Dockerfile stage
- [ ] Add health check to miner if applicable
- [ ] Test health checks in docker-compose

### 6. Reduce Image Sizes Further

**Status:** Current sizes ~295-347MB  
**Priority:** Low

- [ ] Audit production dependencies for unnecessary packages
- [ ] Consider using distroless or alpine base images
- [ ] Evaluate if all dependencies are truly needed in production
- [ ] Use `pnpm prune --prod` if beneficial

## Code Quality & Testing

### 7. Add Package-Specific Linting Configurations

**Status:** Using root oxlint configuration  
**Priority:** Low

- [ ] Evaluate if packages need different linting rules
- [ ] Add `.oxlintrc.json` per package if needed
- [ ] Document any package-specific lint rules

### 8. Improve Test Coverage

**Status:** 76/76 tests passing  
**Priority:** Medium

- [ ] Review test coverage reports
- [ ] Identify untested code paths
- [ ] Add integration tests for workspace interactions
- [ ] Add tests for bank/miner communication
- [ ] Set up coverage thresholds per package

### 9. Add E2E Testing

**Status:** Not implemented  
**Priority:** Medium

- [ ] Set up E2E test framework (Playwright, Cypress, or similar)
- [ ] Create E2E tests for full blockchain flows
- [ ] Test bank and miner interaction scenarios
- [ ] Add E2E tests to CI pipeline

## CI/CD Improvements

### 10. Set Up CI/CD Pipeline

**Status:** Compile stage exists but no CI configured  
**Priority:** High

- [ ] Set up GitHub Actions / GitLab CI / Jenkins
- [ ] Add workflow for running tests on PR
- [ ] Add workflow for building Docker images
- [ ] Add workflow for linting and formatting checks
- [ ] Add workflow for publishing images to registry
- [ ] Set up automated deployments

### 11. Optimize CI Build Times

**Status:** N/A - no CI yet  
**Priority:** Medium (after CI setup)

- [ ] Use CI caching for pnpm store
- [ ] Use CI caching for Docker layers
- [ ] Run workspace tests in parallel
- [ ] Only test affected packages on changes

### 12. Add Package-Specific CI Jobs

**Status:** N/A  
**Priority:** Low

- [ ] Create separate CI jobs per workspace package
- [ ] Only run package tests when that package changes
- [ ] Set up monorepo-aware CI tools (Turborepo, Nx, or similar)

## Developer Experience

### 13. Add Development Scripts

**Status:** Basic scripts exist  
**Priority:** Medium

- [ ] Add script to start all services: `pnpm dev:all`
- [ ] Add script to clean all node_modules: `pnpm clean`
- [ ] Add script to rebuild all packages: `pnpm rebuild`
- [ ] Add pre-commit hooks with husky
- [ ] Add commit linting with commitlint

### 14. Improve Workspace Dependency Management

**Status:** Manual updates required  
**Priority:** Medium

- [ ] Document how to update workspace dependencies
- [ ] Add script to check for outdated dependencies
- [ ] Set up Renovate or Dependabot for automated updates
- [ ] Document version bumping strategy for workspace packages

### 15. Add VSCode Workspace Configuration

**Status:** Not configured  
**Priority:** Low

- [ ] Create `.vscode/workspace.code-workspace`
- [ ] Configure recommended extensions
- [ ] Set up debug configurations for each package
- [ ] Add package-specific tasks

## Architecture Improvements

### 16. Evaluate Shared Code Organization

**Status:** All shared code in common package  
**Priority:** Low

- [ ] Review if common package is too large
- [ ] Consider splitting into smaller packages if needed:
  - `@blockchain/domain` - core domain models
  - `@blockchain/infrastructure` - infrastructure code
  - `@blockchain/events` - event definitions
  - `@blockchain/commands` - command definitions
- [ ] Document decision and rationale

### 17. Add API Documentation

**Status:** Not documented  
**Priority:** Medium

- [ ] Document bank API endpoints
- [ ] Add OpenAPI/Swagger spec for bank service
- [ ] Document miner configuration options
- [ ] Add JSDoc comments to public APIs

### 18. Add Observability

**Status:** Not implemented  
**Priority:** Medium

- [ ] Add structured logging
- [ ] Add metrics collection (Prometheus, StatsD)
- [ ] Add distributed tracing (OpenTelemetry, Jaeger)
- [ ] Add logging correlation IDs across services
- [ ] Set up monitoring dashboards

## Security

### 19. Security Audit

**Status:** Not performed  
**Priority:** High

- [ ] Audit dependencies for known vulnerabilities
- [ ] Set up `pnpm audit` in CI
- [ ] Review Dockerfile for security best practices
- [ ] Ensure secrets are not committed to repo
- [ ] Add secret scanning to CI
- [ ] Review and update `.dockerignore`

### 20. Add Security Headers

**Status:** Not implemented  
**Priority:** Medium

- [ ] Add security headers to bank HTTP responses
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Implement request validation

## Performance

### 21. Performance Testing

**Status:** Not implemented  
**Priority:** Low

- [ ] Add load testing for bank service
- [ ] Benchmark miner performance
- [ ] Identify bottlenecks
- [ ] Set performance budgets

### 22. Migrate from tsx Runtime to Compiled JavaScript

**Status:** Currently using tsx runtime (no compilation)  
**Priority:** Medium-High

**Why:** Compiled JavaScript runs faster, reduces memory overhead, smaller Docker images (no tsx dependency), better production stability, enables modern pnpm deploy without --legacy flag.

**Implementation Steps:**

- [ ] **Update tsconfig.json for each package**

  ```json
  {
    "compilerOptions": {
      "outDir": "./dist",
      "rootDir": "./src",
      "declaration": true,
      "declarationMap": true,
      "sourceMap": true
    }
  }
  ```

- [ ] **Add build scripts to package.json files**
  - Root: `"build": "pnpm -r build"`
  - Common: `"build": "tsc --project tsconfig.json"`
  - Bank: `"build": "tsc --project tsconfig.json"`
  - Miner: `"build": "tsc --project tsconfig.json"`

- [ ] **Update package.json main/module/types fields**

  ```json
  {
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "files": ["dist"]
  }
  ```

- [ ] **Update workspace dependencies to use compiled output**
  - Verify imports resolve to `dist/` files
  - Test that type checking works with declaration files

- [ ] **Update Dockerfile to use compiled output**
  - Build TypeScript in `compile` stage
  - Copy only `dist/` folders and node_modules to final images
  - Remove tsx from dependencies
  - Update CMD/ENTRYPOINT to use `node` instead of `tsx`

- [ ] **Update docker-compose.yml commands**
  - Bank: `command: node /usr/app/packages/bank/dist/server.js`
  - Miner: `command: node /usr/app/packages/miner/dist/index.js`

- [ ] **Add dist/ to .gitignore**

  ```
  # Build output
  dist/
  *.tsbuildinfo
  ```

- [ ] **Update .dockerignore to exclude source but include dist**

  ```
  # Exclude source TypeScript files in production builds
  **/*.ts
  !**/*.d.ts

  # Include compiled output
  !**/dist/**
  ```

- [ ] **Update CI/CD pipeline**
  - Add build step before tests
  - Run tests against compiled code
  - Cache build artifacts

- [ ] **Add incremental builds for development**
  - Use `tsc --watch` or `tsc-watch` for dev mode
  - Add dev scripts: `"dev": "tsc --watch"`

- [ ] **Test thoroughly**
  - Verify all imports work with compiled code
  - Test workspace package resolution
  - Test Docker images with compiled output
  - Benchmark startup time (should be faster)
  - Measure memory usage (should be lower)

- [ ] **Update pnpm deploy approach (optional)**
  - Remove `--legacy` flag (modern deploy works with built artifacts)
  - Configure `.pnpmrc`: `inject-workspace-packages=true`
  - Deploy will inject compiled `dist/` folders

- [ ] **Update documentation**
  - Document new build process
  - Update developer guide with build commands
  - Document troubleshooting for build errors

**Expected Benefits:**

- 🚀 Faster startup time (~3-5x faster)
- 📦 Smaller Docker images (no tsx + esbuild dependencies ~40-60MB savings)
- 💾 Lower memory usage in production
- 🎯 Better error stack traces in production
- ✅ Enables modern pnpm deploy without --legacy
- 🔒 Production code is immutable (compiled once)

**Migration Risks:**

- Import paths may need adjustment
- Build step adds complexity to development workflow
- Need to ensure source maps work for debugging
- CI/CD pipeline becomes slightly more complex

**Rollback Plan:**

- Keep tsx as devDependency for development
- Can revert Dockerfile changes to use tsx if needed
- Maintain both approaches during transition period

## Future Considerations

### 23. Evaluate Build Tools

**Status:** Using tsx for runtime execution  
**Priority:** Low

- [ ] Consider adding esbuild/swc for faster builds if needed
- [ ] Evaluate if bundling would reduce Docker image size
- [ ] Research Turborepo or Nx for monorepo management
- [ ] Document tooling decisions

### 24. Database Migrations

**Status:** Unknown if applicable  
**Priority:** Depends on requirements

- [ ] Add migration framework if using database
- [ ] Document migration strategy
- [ ] Add migration scripts to docker-compose
- [ ] Test migrations in CI

### 25. Kubernetes Deployment

**Status:** Using docker-compose only  
**Priority:** Low

- [ ] Create Kubernetes manifests (Deployment, Service, ConfigMap)
- [ ] Add Helm charts
- [ ] Set up ingress configuration
- [ ] Document K8s deployment process

## Documentation Tasks

### 26. Architecture Decision Records (ADRs)

**Status:** Not created  
**Priority:** Medium

- [ ] Create ADR for workspace structure decision
- [ ] Create ADR for Docker multi-stage approach
- [ ] Create ADR for tsx runtime vs compilation
- [ ] Create ADR for using pnpm workspaces
- [ ] Create ADR template for future decisions

### 27. Troubleshooting Guide

**Status:** Not created  
**Priority:** Medium

- [ ] Document common issues and solutions
- [ ] Add section on debugging Docker containers
- [ ] Add section on debugging workspace dependencies
- [ ] Add section on debugging TypeScript imports
- [ ] Document how to recover from failed migrations

## Cleanup

### 28. Remove Deprecated Code

**Status:** Old src/ directory already removed  
**Priority:** High

- [x] Removed old `src/` directory
- [ ] Search for TODO comments and address them
- [ ] Remove any unused dependencies
- [ ] Remove commented-out code
- [ ] Clean up any temporary files

### 29. Verify .gitignore

**Status:** Needs review  
**Priority:** Medium

- [ ] Ensure all node_modules are ignored
- [ ] Ensure Docker build artifacts are ignored
- [ ] Ensure editor-specific files are ignored
- [ ] Ensure secrets and .env files are ignored
- [ ] Add coverage reports to .gitignore if needed

## Timeline Suggestions

### Week 1 (Critical)

1. Test Docker Images (#1)
2. Security Audit (#19)
3. Update Documentation (#2)

### Week 2-3 (Important)

4. Set Up CI/CD Pipeline (#10)
5. Migrate from tsx to Compiled JavaScript (#22) - **New priority**
6. Improve Test Coverage (#8)
7. Add API Documentation (#17)

### Month 2 (Medium Priority)

8. Add E2E Testing (#9)
9. Add Observability (#18)
10. Add Docker Health Checks (#5)

### Ongoing

- Monitor performance (#21)
- Keep dependencies updated (#14)
- Review and update documentation as needed

**Note:** Item #22 (tsx to compiled JS migration) has been elevated in priority as it provides significant production benefits and enables cleaner Docker deployments.

## Success Metrics

Track progress with these metrics:

- **Test Coverage:** Maintain >80% code coverage
- **Build Time:** Keep Docker builds under 5 minutes
- **Image Size:** Keep images under 400MB each
- **CI Time:** Keep full CI pipeline under 10 minutes
- **Dependencies:** Zero high/critical vulnerabilities
- **Documentation:** All public APIs documented

## Notes

- Prioritize based on your team's specific needs
- Some items may not be applicable to your use case
- Review and update this document quarterly
- Mark items complete as you finish them
- Add new items as they arise
