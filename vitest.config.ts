import { mergeConfig } from 'vitest/config';
import shared from './vitest.shared.config.ts';

export default mergeConfig(shared, {
  test: {
    projects: ['packages/common', 'packages/bank']
  }
});
