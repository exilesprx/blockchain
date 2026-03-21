import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/tests/**/*.test.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**/*.ts'],
      exclude: ['node_modules/', 'tests/', '**/*.test.ts', '**/*.d.ts']
    },
    clearMocks: true
  },
  resolve: {
    alias: {
      '@blockchain/common': path.resolve(__dirname, './packages/common/src'),
      '@blockchain/bank': path.resolve(__dirname, './packages/bank/src'),
      '@blockchain/miner': path.resolve(__dirname, './packages/miner/src')
    }
  }
});
