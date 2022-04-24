import Events from 'events';
import Block from '../src/domain/chain/block';
import Emitter from '../src/app/events/emitter';
import KafkaLogger from '../src/domain/logs/kafka-logger';
import Logger from '../src/domain/logs/logger';
import Producer from '../src/domain/stream/producer';
import Stream from '../src/domain/stream/stream';
import Transaction from '../src/domain/wallet/transaction';

jest.mock('events');
jest.mock('kafkajs');
jest.mock('../src/domain/logs/logger');
jest.mock('../src/domain/logs/kafka-logger');
jest.mock('../src/domain/stream/stream');
jest.mock('../src/domain/stream/producer');

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

    expect(producer.sendTransaction).toHaveBeenLastCalledWith(transaction);
  });

  test('it expects to call emit on EventEmitter', () => {
    const emitter = new Emitter(events, producer, logger);

    emitter.emit('test', 1);

    expect(events.emit).toHaveBeenLastCalledWith('test', 1);
  });
});
