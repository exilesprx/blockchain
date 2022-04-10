import Events from 'events';
import { Kafka } from 'kafkajs';
import Block from '../src/domain/chain/block';
import Emitter from '../src/domain/events/emitter';
import logger from '../src/domain/logs/logger';
import Producer from '../src/domain/stream/producer';
import Transaction from '../src/domain/wallet/transaction';

jest.mock('events');
jest.mock('kafkajs');

let events: Events;

const kafka: Kafka = new Kafka({ brokers: [] });

const producer: Producer = new Producer(kafka);

describe('Emitter', () => {
  beforeAll(() => {
    events = new Events();

    jest.spyOn(producer, 'send')
      .mockImplementation(() => null);

    jest.spyOn(logger, 'info')
      .mockImplementation(() => null);
  });

  test('it expects the listeners can be configured', () => {
    const emitter = new Emitter(events, producer, logger);

    const spy = jest.fn();

    emitter.register('test', spy);

    expect(events.on).toHaveBeenCalledTimes(1);

    expect(events.on).toBeCalledWith('test', spy);
  });

  test('it expects a log and kafka message when adding a block', () => {
    const emitter = new Emitter(events, producer, logger);

    const block = new Block(1, 0, 0, 'test', []);

    emitter.blockAdded(block);

    expect(logger.info).toHaveBeenCalledTimes(1);

    expect(logger.info).toBeCalledWith(`Block added: ${block.getHash()}`);
  });

  test('it expects a log and kafka message when adding a transaction', () => {
    const emitter = new Emitter(events, producer, logger);

    const transaction = new Transaction('1', '2', 50);

    emitter.transactionAdded(transaction);

    expect(logger.info).toHaveBeenCalledTimes(1);

    expect(producer.send).toHaveBeenLastCalledWith('transaction-added', transaction);
  });

  test('it expects to call emit on EventEmitter', () => {
    const emitter = new Emitter(events, producer, logger);

    emitter.emit('test', 1);

    expect(events.emit).toHaveBeenLastCalledWith('test', 1);
  });
});
