import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  bundle: true,
  noExternal: [/^(?!node:)/],
  clean: true,
  sourcemap: true,
  tsconfig: 'tsconfig.json',
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`
  }
});
