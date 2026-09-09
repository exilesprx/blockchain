import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  platform: 'node',
  bundle: false,
  dts: false,
  clean: true,
  minify: true
});
