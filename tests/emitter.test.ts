import Events from 'events';
import Block from '../src/domain/chain/block';
import Emitter from '../src/app/events/emitter';
import KafkaLogger from '../src/infrastructure/logs/kafka-logger';
import Logger from '../src/infrastructure/logs/logger';
import Producer from '../src/infrastructure/stream/producer';
import Stream from '../src/infrastructure/stream/stream';
import Transaction from '../src/domain/wallet/transaction';

jest.mock('events');
jest.mock('kafkajs');
jest.mock('../src/infrastructure/logs/logger');
jest.mock('../src/infrastructure/logs/kafka-logger');
jest.mock('../src/infrastructure/stream/stream');
jest.mock('../src/infrastructure/stream/producer');

const events: Events = new Events();

const logger: Logger = new Logger();

const kafkaLogger = new KafkaLogger(logger);

const stream: Stream = new Stream(kafkaLogger);

const producer: Producer = new Producer(stream);

describe('Emitter', () => {
  beforeAll(() => {
    Events.mockClear();

    Logger.mockClear();

    Producer.mockClear();
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

    const block = new Block(1, 0, 0, 'test', [], 0);

    emitter.blockAdded(block);

    expect(logger.info).toHaveBeenCalledTimes(1);

    expect(logger.info).toBeCalledWith(`Block added: ${block.getHash()}`);
  });

  test('it expects a log and kafka message when adding a transaction', () => {
    const emitter = new Emitter(events, producer, logger);

    const transaction = new Transaction('1', '2', 50);

    emitter.transactionAdded(transaction);

    expect(logger.info).toHaveBeenCalledTimes(1);

    expect(producer.sendTransaction).toHaveBeenLastCalledWith(transaction);
  });

  test('it expects to call emit on EventEmitter', () => {
    const emitter = new Emitter(events, producer, logger);

    emitter.emit('test', 1);

    expect(events.emit).toHaveBeenLastCalledWith('test', 1);
  });
});
