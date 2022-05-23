import Block from '../src/domain/chain/block';
import Transaction from '../src/domain/wallet/transaction';
import BlockTranslator from '../src/infrastructure/stream/translators/block-translator';
import data from './stubs/block.json';

describe('Block Translator', () => {
  test('it expects to translate a message into a block', () => {
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
