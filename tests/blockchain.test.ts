import Blockchain from '../src/domain/chain/blockchain';
import BlockLimitPolicy from '../src/domain/policies/block-limit-policy';
import Block from '../src/domain/chain/block';
import Link from '../src/domain/chain/specifications/link';
import Emitter from '../src/domain/events/emitter';

jest.mock('../src/domain/policies/block-limit-policy');
jest.mock('../src/domain/events/emitter');

describe('Blockchain', () => {
  beforeAll(() => {
    Emitter.mockClear();
  });

  test('it expects to have one block', () => {
    const chain = new Blockchain(jest.fn());

    expect(chain.length()).toBe(1);
  });

  test('it expects to remove a block from the beginning when limit is reached', () => {
    const emitter = new Emitter(jest.fn(), jest.fn(), jest.fn());
    const chain = new Blockchain(emitter);

    jest.spyOn(chain, 'removeFirstBlock');

    // The default is false, but we want to "fake" the chain being full
    BlockLimitPolicy.reachedLimit.mockReturnValueOnce(true);

    chain.addBlock(new Block(1, 1, 1, 'test', []));

    expect(BlockLimitPolicy.reachedLimit).toHaveBeenCalled();

    expect(chain.removeFirstBlock).toHaveBeenCalled();

    expect(Emitter.mock.instances[0].emit).toBeCalled();

    expect(chain.length()).toBe(1);
  });

  test('it expects to add a block', () => {
    const emitter = new Emitter(jest.fn(), jest.fn(), jest.fn());
    const chain = new Blockchain(emitter);

    expect(chain.length()).toBe(1);

    chain.addBlock(new Block(1, 1, 1, 'test', []));

    expect(Emitter.mock.instances[0].emit).toBeCalled();

    expect(chain.length()).toBe(2);
  });

  test('it expects a specification to pass and add a new block', () => {
    const emitter = new Emitter(jest.fn(), jest.fn(), jest.fn());
    const chain = new Blockchain(emitter);

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

    expect(Emitter.mock.instances[0].emit).toBeCalled();
  });

  test('it expects a specification to fail and a block is not added', () => {
    const emitter = new Emitter(jest.fn(), jest.fn(), jest.fn());
    const chain = new Blockchain(emitter);

    chain.addSpecification(new Link());

    expect(() => chain.addBlock(new Block(1, 1, 1, 'test', []))).toThrowError();

    expect(Emitter.mock.instances[0].emit).not.toBeCalled();

    expect(chain.length()).toBe(1);
  });

  test('it expects the ability to add multiple specs at once', () => {
    const emitter = new Emitter(jest.fn(), jest.fn(), jest.fn());
    const chain = new Blockchain(emitter);

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

    expect(Emitter.mock.instances[0].emit).toBeCalled();
  });
});
