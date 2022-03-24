import EventEmitter from 'events';
import Block from '../src/domain/chain/block';
import Events from '../src/domain/events/emitter';
import { logger } from '../src/domain/logs/logger';
import { producer } from '../src/domain/stream/producer';
import Transaction from '../src/domain/wallet/transaction';

jest.mock('events');

const emitter: EventEmitter = new EventEmitter();

describe('Emitter', () => {
  beforeAll(() => {
    jest.spyOn(producer, 'send')
      .mockImplementation(() => null);

    jest.spyOn(logger, 'info')
      .mockImplementation(() => null);
  });

  test('it expects the listeners to be configured', () => {
    const events = Events.register(emitter, producer, logger);

    expect(emitter.on).toHaveBeenCalledTimes(2);

    expect(emitter.on).toHaveBeenCalledWith('block-added', events.blockAdded);

    expect(emitter.on).toHaveBeenLastCalledWith('transaction-added', events.transactionAdded);
  });

  test('it expects a log and kafka message when adding a block', () => {
    const events = Events.register(emitter, producer, logger);

    const block = new Block(1, 0, 0, 'test', []);

    events.blockAdded(block);

    expect(logger.info).toHaveBeenCalledTimes(1);

    expect(producer.send).toHaveBeenLastCalledWith(
      {
        topic: 'block-test',
        messages: [
          {
            key: block.getKey(),
            value: JSON.stringify(block),
          },
        ],
      },
    );
  });

  test('it expects a log and kafka message when adding a transaction', () => {
    const events = Events.register(emitter, producer, logger);

    const transaction = new Transaction('1', '2', 50);

    events.transactionAdded(transaction);

    expect(logger.info).toHaveBeenCalledTimes(1);

    expect(producer.send).toHaveBeenLastCalledWith(
      {
        topic: 'transaction-test',
        messages: [
          {
            key: transaction.getKey(),
            value: JSON.stringify(transaction),
          },
        ],
      },
    );
  });

  test('it expects to call emit on EventEmitter', () => {
    const events = Events.register(emitter, producer, logger);

    events.emit('test', 1);

    expect(emitter.emit).toHaveBeenLastCalledWith('test', 1);
  });
});
