import { beforeAll, describe, expect, vi, test } from 'vitest';

import Events from 'events';
import Block from '@/domain/chain/block';
import Emitter from '@/events/emitter';
import Logger from '@/infrastructure/logs/logger';
import Producer from '@/infrastructure/stream/producer';
import Stream from '@/infrastructure/stream/stream';
import Transaction from '@/domain/wallet/transaction';
import MineFailed from '@/domain/events/mine-failed';
import BlockAdded from '@/domain/events/block-added';
import BlockMined from '@/domain/events/block-mined';
import TransactionAdded from '@/domain/events/transaction-added';

vi.mock('events');
vi.mock('kafkajs');
vi.mock('@/infrastructure/logs/logger');
vi.mock('@/infrastructure/logs/kafka-logger');
vi.mock('@/infrastructure/stream/stream');
vi.mock('@/infrastructure/stream/producer');

describe('Emitter', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  test('it expects the listeners can be configured', () => {
    const producer = vi.mocked(Producer).mock.instances[0];
    const logger = vi.mocked(Logger).mock.instances[0];
    const events = new Events();
    const on = vi.spyOn(events, 'on');
    const emitter = new Emitter(events, producer, logger);
    const fake = vi.fn();

    emitter.register('test', fake);

    expect(on).toHaveBeenCalledWith('test', fake);
  });

  test('it expects a log and kafka message when adding a block', () => {
    const producer = new Producer({} as Stream);
    const sendBlock = vi.spyOn(producer, 'sendBlock');
    const logger = new Logger([]);
    const info = vi.spyOn(logger, 'info');
    const events = new Events();
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
    const logger = new Logger([]);
    const info = vi.spyOn(logger, 'info');
    const producer = vi.mocked(Producer).mock.instances[0];
    const events = new Events();
    const emitter = new Emitter(events, producer, logger);
    const block = new Block(1, 0, 0, 'test', [], 0);
    const event = new BlockMined(block);

    emitter.blockMined(event);

    expect(info).toHaveBeenCalledWith(
      expect.stringContaining(`${block.getKey()}`)
    );
  });

  test('it expects a log when a block fails to be mined', () => {
    const producer = vi.mocked(Producer).mock.instances[0];
    const logger = new Logger([]);
    const err = vi.spyOn(logger, 'error');
    const events = new Events();
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
    const sendTransaction = vi.spyOn(producer, 'sendTransaction');
    const logger = new Logger([]);
    const events = new Events();
    const emitter = new Emitter(events, producer, logger);
    const transaction = new Transaction('1', '2', '50', 3, 20241119);
    const event = new TransactionAdded(transaction);

    emitter.transactionAdded(event);

    expect(sendTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', to: '2', from: '50', amount: 3 })
    );
  });

  test('it expects to call emit on EventEmitter', () => {
    const producer = vi.mocked(Producer).mock.instances[0];
    const logger = vi.mocked(Logger).mock.instances[0];
    const events = new Events();
    const emit = vi.spyOn(events, 'emit');
    const emitter = new Emitter(events, producer, logger);

    emitter.emit('test', 1);

    expect(emit).toHaveBeenCalledWith('test', 1);
  });
});
