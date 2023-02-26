import Blockchain from '../src/domain/chain/blockchain';
import BlockLimitPolicy from '../src/domain/policies/block-limit-policy';
import Block from '../src/domain/chain/block';
import Link from '../src/domain/chain/specifications/link';
import Emitter from '../src/app/events/abstract-emitter';
import BlockMined from '../src/domain/chain/specifications/mined';
import BlockAdded from '../src/domain/events/block-added';

jest.mock('../src/domain/policies/block-limit-policy');
jest.mock('../src/app/events/abstract-emitter');

describe('Blockchain', () => {
  beforeAll(() => {
    Emitter.mockClear();
  });

  test('it expects to have one block', () => {
    const chain = new Blockchain(jest.fn());

    expect(chain.length()).toBe(1);
  });

  test('it expects to remove a block from the beginning when limit is reached', () => {
    const chain = new Blockchain();

    jest.spyOn(chain, 'removeFirstBlock');

    // The default is false, but we want to "fake" the chain being full
    BlockLimitPolicy.reachedLimit.mockReturnValueOnce(true);

    chain.addBlock(new Block(1, 1, 1, 'test', [], 0));

    expect(BlockLimitPolicy.reachedLimit).toHaveBeenCalled();

    expect(chain.removeFirstBlock).toHaveBeenCalled();

    // TODO: update to flush events and check length and type
    expect(chain.length()).toBe(1);
    const events = chain.flushEvents();
    expect(events.length).toBe(1);
    expect(events.at(0)).toBeInstanceOf(BlockAdded);
  });

  test('it expects to add a block', () => {
    const chain = new Blockchain();

    expect(chain.length()).toBe(1);

    chain.addBlock(new Block(1, 1, 1, 'test', [], 0));

    // TODO: update to flush events and check length and type
    expect(chain.length()).toBe(2);
    const events = chain.flushEvents();
    expect(events.length).toBe(1);
    expect(events.at(0)).toBeInstanceOf(BlockAdded);
  });

  test('it expects a specification to pass and add a new block', () => {
    const chain = new Blockchain();

    const link = new Link();

    const block = new Block(1, 1, 1, 'test', [], 0);

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

    // TODO: update to flush events and check length and type
    const events = chain.flushEvents();
    expect(events.length).toBe(1);
    expect(events.at(0)).toBeInstanceOf(BlockAdded);
  });

  test('it expects a specification to fail and a block is not added', () => {
    const chain = new Blockchain();

    chain.addSpecification(new Link());

    expect(() => chain.addBlock(new Block(1, 1, 1, 'test', [], 0))).toThrowError();

    // TODO: update to flush events and check length and type
    expect(chain.length()).toBe(1);

    const events = chain.flushEvents();
    expect(events.length).toBe(0);
  });

  test('it expects an unmined block to be rejected from the chain', () => {
    const chain = new Blockchain();
    const block = new Block(1, 1, 1, 'test', [], 0);

    jest.spyOn(block, 'isMined').mockReturnValue(false);

    chain.addSpecification(new BlockMined());

    expect(() => chain.addBlock(block)).toThrowError();

    expect(chain.length()).toBe(1);
  });

  test('it expects the ability to add multiple specs at once', () => {
    const chain = new Blockchain();

    const link = new Link();

    const block = new Block(1, 1, 1, 'test', [], 0);

    const spy = jest.spyOn(link, 'isSatisfiedBy')
      .mockReturnValue(true);

    chain.addSpecification(link, link, link);

    chain.addBlock(block);

    expect(spy).toBeCalledTimes(3);

    expect(spy).toBeCalledWith(
      expect.any(Block),
      block,
    );

    // TODO: update to flush events and check length and type
  });
  test('it flushes the events', () => {
    const chain = new Blockchain();
    const block = new Block(1, 1, 1, 'test', [], 0);
    chain.addBlock(block);

    expect(chain.flushEvents().length).toBe(1);
    expect(chain.flushEvents().length).toBe(0);
  });
});
