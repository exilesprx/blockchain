import Block from '../src/domain/chain/block';
import BlockMinedPolicy from '../src/domain/policies/block-mined-policy';
import Transaction from '../src/domain/wallet/transaction';

jest.mock('../src/domain/policies/block-mined-policy');

describe('Block', () => {
  beforeAll(() => {
    BlockMinedPolicy.mockClear();
  });

  test('it expects to have zero transactions', () => {
    const block = new Block(1, 0, 0, 'test', []);

    expect(block.getTransactions().length).toBe(0);

    expect(block.getKey()).toBe(1);
  });

  test('it expects to have 1 transaction', () => {
    const transaction = new Transaction('tester1', 'tester2', 3);

    const block = new Block(1, 0, 0, 'test', [transaction]);

    expect(block.getTransactions().length).toBe(1);

    expect(block.getKey()).toBe(1);
  });

  test('it expects two different blocks to have unique hashes', () => {
    const firstBlock = new Block(1, 0, 0, 'test', []);

    const secondBlock = new Block(1, 0, 0, 'test-1', []);

    expect(firstBlock.getHash()).not.toBe(secondBlock.getHash());

    expect(firstBlock.getKey()).toBe(1);

    expect(secondBlock.getKey()).toBe(1);
  });

  test('it expects the block to be mined after 2 attempts', () => {
    const block = new Block(1, 0, 1, 'test', []);

    const hash = block.getHash();

    BlockMinedPolicy.mined
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    block.mine();

    expect(BlockMinedPolicy.mined).toBeCalledTimes(2);

    expect(BlockMinedPolicy.mined).toBeCalledWith(expect.any(String), 1);

    expect(block.getHash()).not.toEqual(hash);
  });
});
