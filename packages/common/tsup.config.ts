import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  platform: 'node',
  bundle: false,
  dts: true, // needed since bank and miner import from it
  clean: true
});
