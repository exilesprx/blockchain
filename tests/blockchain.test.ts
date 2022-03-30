import Blockchain from '../src/domain/chain/blockchain';
import BlockLimitPolicy from '../src/domain/policies/block-limit-policy';
import Block from '../src/domain/chain/block';

jest.mock('../src/domain/policies/block-limit-policy');

describe('Blockchain', () => {
  beforeAll(() => {
    BlockLimitPolicy.reachedLimit.mockReturnValue(false);
  });

  test('it expects to have one block', () => {
    const chain = new Blockchain();

    expect(chain.length()).toBe(1);
  });

  test('it expects to remove a block from the beginning when limit is reached', () => {
    const chain = new Blockchain();

    jest.spyOn(chain, 'removeFirstBlock');

    // The default is false, but we want to "fake" the chain being full
    BlockLimitPolicy.reachedLimit.mockReturnValueOnce(true);

    chain.addBlock(new Block(1, 1, 1, 'test', []));

    expect(BlockLimitPolicy.reachedLimit).toHaveBeenCalled();

    expect(chain.removeFirstBlock).toHaveBeenCalled();

    expect(chain.length()).toBe(1);
  });

  test('it expects to add a block', () => {
    const chain = new Blockchain();

    expect(chain.length()).toBe(1);

    chain.addBlock(new Block(1, 1, 1, 'test', []));

    expect(chain.length()).toBe(2);
  });
});
