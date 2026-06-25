import { beforeAll, describe, expect, vi, test } from 'vitest';

import BlockMinedPolicy from '@/domain/policies/block-mined-policy';
import BlockBuilder from './builders/block';

vi.mock('@/domain/policies/block-mined-policy');
let builder: BlockBuilder = new BlockBuilder();

describe('Block', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  test('it expects to have zero transactions', () => {
    const block = builder.withNoTransactions().build();

    expect(block.getTransactions().length).toBe(0);
  });

  test('it expects to have 1 transaction', () => {
    const block = builder.withOneTransaction().build();

    expect(block.getTransactions().length).toBe(1);
  });

  test('it expects two different blocks to have unique hashes', () => {
    const firstBlock = builder.withNoTransactions().build();
    const secondBlock = builder.withNoTransactions().build();

    expect(firstBlock.getHash()).not.toBe(secondBlock.getHash());
  });

  test('it expects the block to be mined after 2 attempts', async () => {
    const block = builder.withNoTransactions().build();
    const hash = block.getHash();
    vi.mocked(BlockMinedPolicy.containsSuccessiveChars)
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);

    expect(block.isMined()).toBe(false);

    await block.mine();
    expect(BlockMinedPolicy.containsSuccessiveChars).toHaveBeenCalledWith(
      expect.any(String),
      1
    );
    expect(block.getHash()).not.toEqual(hash);
    expect(block.isMined()).toBe(true);
  });

  test('it expects a new block to be considered unmined', () => {
    const block = builder.withNoTransactions().build();

    expect(block.isMined()).toBe(false);
  });

  test('it converts the data to a json object', () => {
    const block = builder.withNoTransactions().build();
    const json = block.toJson();

    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('transactions');
    expect(json).toHaveProperty('nounce');
    expect(json).toHaveProperty('difficulty');
    expect(json).toHaveProperty('previousHash');
    expect(json).toHaveProperty('hash');
    expect(json).toHaveProperty('date');
  });
});
