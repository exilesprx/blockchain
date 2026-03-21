import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['node_modules/', 'tests/', '**/*.test.ts', '**/*.d.ts']
    },
    clearMocks: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@blockchain/common': path.resolve(__dirname, './src'),
      '@blockchain/bank': path.resolve(__dirname, '../bank/src'),
      '@blockchain/miner': path.resolve(__dirname, '../miner/src')
    }
  }
});
