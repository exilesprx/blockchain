import Block from '../src/domain/chain/block';
import Mined from '../src/domain/chain/state/mined';
import Unmined from '../src/domain/chain/state/unmined';
import BlockMinedPolicy from '../src/domain/policies/block-mined-policy';
import Transaction from '../src/domain/wallet/transaction';
import BlockTranslator from '../src/infrastructure/stream/translators/block-translator';
import data from './stubs/block.json';

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
    const transaction = new Transaction('tester1', 'tester2', 3);

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

    await block.mine();

    expect(BlockMinedPolicy.containsSuccessiveChars).toBeCalledTimes(2);

    expect(BlockMinedPolicy.containsSuccessiveChars).toBeCalledWith(expect.any(String), 1);

    expect(block.getHash()).not.toEqual(hash);

    expect(block.isMined()).toBeTruthy();
  });

  test('it expects to translate a consumer message into a block', () => {
    const block = BlockTranslator.fromMessage(
      Buffer.from(JSON.stringify(data)),
    );

    expect(block).toBeInstanceOf(Block);

    block.getTransactions().forEach((transaction) => {
      expect(transaction).toBeInstanceOf(Transaction);
    });

    expect(block.getHash()).toBe('00d27024e9d5cc76db419b25be702aff8ecaab4cfcc43759c140de6967d9b4bd');

    expect(block.getDate()).toBe(1651979137030);

    expect(block.getKey()).toBe('47254a8a-1aaf-42ad-a4cd-f0afb0578b33');

    expect(block.getTransactions().length).toBe(20);

    expect(block.getTransactions()[0]).toBeInstanceOf(Transaction);
  });
});
