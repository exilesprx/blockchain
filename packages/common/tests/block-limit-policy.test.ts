import { beforeAll, describe, expect, vi, test } from 'vitest';
import Blockchain from '../src/domain/chain/blockchain';
import BlockLimitPolicy from '../src/domain/policies/block-limit-policy';

describe('Block limt policy', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });
  test('it expects limit is not reached', () => {
    const chain: Blockchain = new Blockchain();
    vi.spyOn(chain, 'length').mockImplementation(() => 1);

    expect(BlockLimitPolicy.reachedLimit(chain)).toBeFalsy();
  });

  test('it expects limit is reached', () => {
    const chain: Blockchain = new Blockchain();
    vi.spyOn(chain, 'length').mockImplementation(() =>
      BlockLimitPolicy.getLimit()
    );

    expect(BlockLimitPolicy.reachedLimit(chain)).toBeTruthy();
  });
});
