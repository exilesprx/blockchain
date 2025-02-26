import { describe, expect, jest, test } from '@jest/globals';

import Events from 'events';
import Block from '../src/domain/chain/block';
import Emitter from '../src/app/events/emitter';
import Logger from '../src/infrastructure/logs/logger';
import Producer from '../src/infrastructure/stream/producer';
import Stream from '../src/infrastructure/stream/stream';
import Transaction from '../src/domain/wallet/transaction';
import MineFailed from '../src/domain/events/mine-failed';
import BlockAdded from '../src/domain/events/block-added';
import BlockMined from '../src/domain/events/block-mined';
import TransactionAdded from '../src/domain/events/transaction-added';

jest.mock('events');
jest.mock('kafkajs');
jest.mock('../src/infrastructure/logs/logger');
jest.mock('../src/infrastructure/logs/kafka-logger');
jest.mock('../src/infrastructure/stream/stream');
jest.mock('../src/infrastructure/stream/producer');

describe('Emitter', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('it expects the listeners can be configured', () => {
    const producer = jest.mocked(Producer).mock.instances[0];
    const logger = jest.mocked(Logger).mock.instances[0];
    const events = new Events();
    const on = jest.spyOn(events, 'on');
    const emitter = new Emitter(events, producer, logger);
    const fake = jest.fn();

    emitter.register('test', fake);

    expect(on).toHaveBeenCalledWith('test', fake);
  });

  test('it expects a log and kafka message when adding a block', () => {
    const producer = new Producer({} as Stream);
    const sendBlock = jest.spyOn(producer, 'sendBlock');
    const logger = new Logger();
    const info = jest.spyOn(logger, 'info');
    const events = jest.mocked(Events).mock.instances[0];
    const emitter = new Emitter(events, producer, logger);
    const block = new Block(1, 0, 0, 'test', [], 0);
    const event = new BlockAdded(block);

    emitter.blockAdded(event);

    expect(info).toHaveBeenCalledWith(
      expect.stringContaining(`${block.getHash()}`)
    );
    expect(sendBlock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        hash: block.getHash(),
        previousHash: 'test'
      })
    );
  });

  test('it expects a log when a block is mined', () => {
    const logger = new Logger();
    const info = jest.spyOn(logger, 'info');
    const producer = jest.mocked(Producer).mock.instances[0];
    const events = jest.mocked(Events).mock.instances[0];
    const emitter = new Emitter(events, producer, logger);
    const block = new Block(1, 0, 0, 'test', [], 0);
    const event = new BlockMined(block);

    emitter.blockMined(event);

    expect(info).toHaveBeenCalledWith(
      expect.stringContaining(`${block.getKey()}`)
    );
  });

  test('it expects a log when a block fails to be mined', () => {
    const producer = jest.mocked(Producer).mock.instances[0];
    const logger = new Logger();
    const err = jest.spyOn(logger, 'error');
    const events = jest.mocked(Events).mock.instances[0];
    const emitter = new Emitter(events, producer, logger);
    const block = new Block(1, 0, 0, 'test', [], 0);
    const event = new MineFailed(block, 'Failed to mine');

    emitter.mineFailed(event);

    expect(err).toHaveBeenCalledWith(
      expect.stringContaining(`${block.getKey()}`) &&
        expect.stringContaining('Failed to mine')
    );
  });

  test('it expects a log and kafka message when adding a transaction', () => {
    const producer = new Producer({} as Stream);
    const sendTransaction = jest.spyOn(producer, 'sendTransaction');
    const logger = new Logger();
    const events = jest.mocked(Events).mock.instances[0];
    const emitter = new Emitter(events, producer, logger);
    const transaction = new Transaction('1', '2', '50', 3, 20241119);
    const event = new TransactionAdded(transaction);

    emitter.transactionAdded(event);

    expect(sendTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', to: '2', from: '50', amount: 3 })
    );
  });

  test('it expects to call emit on EventEmitter', () => {
    const producer = jest.mocked(Producer).mock.instances[0];
    const logger = jest.mocked(Logger).mock.instances[0];
    const events = new Events();
    const emit = jest.spyOn(events, 'emit');
    const emitter = new Emitter(events, producer, logger);

    emitter.emit('test', 1);

    expect(emit).toHaveBeenCalledWith('test', 1);
  });
});
