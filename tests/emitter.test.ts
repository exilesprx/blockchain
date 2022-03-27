import EventEmitter from 'events';
import { Kafka } from 'kafkajs';
import Block from '../src/domain/chain/block';
import Events from '../src/domain/events/emitter';
import logger from '../src/domain/logs/logger';
import Producer from '../src/domain/stream/producer';
import Transaction from '../src/domain/wallet/transaction';

jest.mock('events');
jest.mock('kafkajs');

let emitter: EventEmitter;

const kafka: Kafka = new Kafka({ brokers: [] });

const producer: Producer = new Producer(kafka);

describe('Emitter', () => {
  beforeAll(() => {
    emitter = new EventEmitter();

    jest.spyOn(producer, 'send')
      .mockImplementation(() => null);

    jest.spyOn(logger, 'info')
      .mockImplementation(() => null);
  });

  test('it expects the listeners can be configured', () => {
    const events = new Events(emitter, producer, logger);

    const spy = jest.fn();

    events.register('test', spy);

    expect(emitter.on).toHaveBeenCalledTimes(1);

    expect(emitter.on).toBeCalledWith('test', spy);
  });

  test('it expects a log and kafka message when adding a block', () => {
    const events = new Events(emitter, producer, logger);

    const block = new Block(1, 0, 0, 'test', []);

    events.blockAdded(block);

    expect(logger.info).toHaveBeenCalledTimes(1);

    expect(logger.info).toBeCalledWith(`Block added: ${block.getHash()}`);
  });

  test('it expects a log and kafka message when adding a transaction', () => {
    const events = new Events(emitter, producer, logger);

    const transaction = new Transaction('1', '2', 50);

    events.transactionAdded(transaction);

    expect(logger.info).toHaveBeenCalledTimes(1);

    expect(producer.send).toHaveBeenLastCalledWith('transaction-added', transaction);
  });

  test('it expects to call emit on EventEmitter', () => {
    const events = new Events(emitter, producer, logger);

    events.emit('test', 1);

    expect(emitter.emit).toHaveBeenLastCalledWith('test', 1);
  });
});
