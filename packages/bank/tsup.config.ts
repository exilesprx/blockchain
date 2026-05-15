import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  platform: 'node',
  bundle: true,
  clean: true,
  sourcemap: true,
  tsconfig: 'tsconfig.json',
  minify: true
});
