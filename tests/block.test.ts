import { v4 } from 'uuid';
import Block from '../src/domain/chain/block';
import BlockMinedPolicy from '../src/domain/policies/block-mined-policy';
import Transaction from '../src/domain/wallet/transaction';

jest.mock('../src/domain/policies/block-mined-policy');

describe('Block', () => {
  beforeAll(() => {
    BlockMinedPolicy.mockClear();
  });

  test('it expects to have zero transactions', () => {
    const block = new Block(1, 0, 0, 'test', [], 0);

    expect(block.getTransactions().length).toBe(0);

    expect(block.getKey()).toBe(1);
  });

  test('it expects to have 1 transaction', () => {
    const transaction = new Transaction(v4(), 'tester1', 'tester2', 3, 0);

    const block = new Block(1, 0, 0, 'test', [transaction], 0);

    expect(block.getTransactions().length).toBe(1);

    expect(block.getKey()).toBe(1);
  });

  test('it expects two different blocks to have unique hashes', () => {
    const firstBlock = new Block(1, 0, 0, 'test', [], 0);

    const secondBlock = new Block(1, 0, 0, 'test-1', [], 0);

    expect(firstBlock.getHash()).not.toBe(secondBlock.getHash());

    expect(firstBlock.getKey()).toBe(1);

    expect(secondBlock.getKey()).toBe(1);
  });

  test('it expects the block to be mined after 2 attempts', async () => {
    const block = new Block(1, 0, 1, 'test', [], 0);

    const hash = block.getHash();

    BlockMinedPolicy.containsSuccessiveChars
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    expect(block.isMined()).toBe(false);

    await block.mine();

    expect(BlockMinedPolicy.containsSuccessiveChars).toBeCalledWith(expect.any(String), 1);

    expect(block.getHash()).not.toEqual(hash);

    expect(block.isMined()).toBe(true);
  });

  test('it expects a new block to be considered unmined', () => {
    BlockMinedPolicy.containsSuccessiveChars
      .mockReturnValueOnce(false);

    const block = new Block(1, 0, 1, 'test', [], 0);

    expect(block.isMined()).toBe(false);
  });

  test('it expects a block to be considered mined', () => {
    BlockMinedPolicy.containsSuccessiveChars
      .mockReturnValueOnce(true);

    const block = new Block(1, 0, 1, 'test', [], 0);

    expect(block.isMined()).toBe(true);
  });
});
