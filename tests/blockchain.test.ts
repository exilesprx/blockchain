import Blockchain from '../src/domain/chain/blockchain';
import BlockLimitPolicy from '../src/domain/policies/block-limit-policy';
import Block from '../src/domain/chain/block';
import Link from '../src/domain/chain/specifications/link';

jest.mock('../src/domain/policies/block-limit-policy');

describe('Blockchain', () => {
  beforeAll(() => {
    //
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

  test('it expects a specification to pass and add a new block', () => {
    const chain = new Blockchain();

    const link = new Link();

    const block = new Block(1, 1, 1, 'test', []);

    const spy = jest.spyOn(link, 'isSatisfiedBy')
      .mockImplementation(() => true);

    chain.addSpecification(link);

    chain.addBlock(block);

    expect(spy).toBeCalled();

    expect(chain.length()).toBe(2);

    expect(spy).toBeCalledWith(
      expect.any(Block),
      block,
    );
  });

  test('it expects a specification to fail and a block is not added', () => {
    const chain = new Blockchain();

    chain.addSpecification(new Link());

    expect(() => chain.addBlock(new Block(1, 1, 1, 'test', []))).toThrowError();

    expect(chain.length()).toBe(1);
  });

  test('it expects the ability to add multiple specs at once', () => {
    const chain = new Blockchain();

    const link = new Link();

    const block = new Block(1, 1, 1, 'test', []);

    const spy = jest.spyOn(link, 'isSatisfiedBy')
      .mockReturnValue(true);

    chain.addSpecification(link, link, link);

    chain.addBlock(block);

    expect(spy).toBeCalledTimes(3);

    expect(spy).toBeCalledWith(
      expect.any(Block),
      block,
    );
  });
});
