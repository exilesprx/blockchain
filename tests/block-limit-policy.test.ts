import EventEmitter from 'events';
import Blockchain from '../src/domain/chain/blockchain';
import Events from '../src/domain/events/emitter';
import BlockLimitPolicy from '../src/domain/policies/block-limit-policy';
import { producer } from '../src/domain/stream/producer';
import { logger } from '../src/domain/logs/logger';

jest.mock('../src/chain/blockchain');
jest.mock('../src/events/emitter');
jest.mock('../src/stream/producer');
jest.mock('../src/logs/logger');
jest.mock('events');

const emitter = new EventEmitter();

const events = new Events(emitter, producer, logger);

describe('Block limt policy', () => {
  test('it expects limit is not reached', () => {
    const chain = new Blockchain(events);

    jest.spyOn(chain, 'length')
      .mockReturnValue(1);

    expect(BlockLimitPolicy.reachedLimit(chain)).toBeFalsy();
  });

  test('it expects limit is reached', () => {
    const chain = new Blockchain(events);

    jest.spyOn(chain, 'length')
      .mockReturnValue(10);

    expect(BlockLimitPolicy.reachedLimit(chain)).toBeTruthy();
  });

  test('it expects limit to be 10', () => {
    expect(BlockLimitPolicy.getLimit()).toBe(10);
  });
});
