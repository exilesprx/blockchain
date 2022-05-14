import Block from '../src/domain/chain/block';
import BlockMinedPolicy from '../src/domain/policies/block-mined-policy';
import Transaction from '../src/domain/wallet/transaction';
import BlockTranslator from '../src/infrastructure/stream/translators/block-translator';
import BlockMessage from '../src/app/data-transfer-objects/block';
import data from './stubs/block.json';

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

  test('it expects the block to be mined after 2 attempts', async () => {
    const block = new Block(1, 0, 1, 'test', []);

    const hash = block.getHash();

    BlockMinedPolicy.mined
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    await block.mine();

    expect(BlockMinedPolicy.mined).toBeCalledTimes(2);

    expect(BlockMinedPolicy.mined).toBeCalledWith(expect.any(String), 1);

    expect(block.getHash()).not.toEqual(hash);
  });

  test('it expects', () => {
    const blockMessage = BlockTranslator.toBlock(
      Buffer.from(JSON.stringify(data)),
    );

    expect(blockMessage).toBeInstanceOf(BlockMessage);

    blockMessage.transactions.forEach((transaction) => {
      expect(transaction).toBeInstanceOf(Transaction);
    });

    expect(block.getHash()).toBe('00d27024e9d5cc76db419b25be702aff8ecaab4cfcc43759c140de6967d9b4bd');
  });
});
