import BlockMinedPolicy from '../src/domain/policies/block-mined-policy';
import BlockBuilder from './builders/block';

jest.mock('../src/domain/policies/block-mined-policy');

let builder: BlockBuilder;

describe('Block', () => {
  beforeAll(() => {
    builder = new BlockBuilder();

    BlockMinedPolicy.mockClear();
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

    BlockMinedPolicy.containsSuccessiveChars
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    expect(block.isMined()).toBe(false);

    await block.mine();

    expect(BlockMinedPolicy.containsSuccessiveChars)
      .toBeCalledWith(expect.any(String), expect.any(Number));

    expect(block.getHash()).not.toEqual(hash);

    expect(block.isMined()).toBe(true);
  });

  test('it expects a new block to be considered unmined', () => {
    const block = builder.withNoTransactions().build();

    expect(block.isMined()).toBe(false);
  });
  
  test('it converts the data to an array', () => {

  });
});
