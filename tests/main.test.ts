import { beforeAll, describe, expect, vi, test } from 'vitest';

import Application from '@/app/bank/main';
import TransactionRoute from '@/app/routes/transaction';
import Server from '@/app/server';
import Database from '@/infrastructure/database';
import Blockchain from '@/domain/chain/blockchain';
import Link from '@/domain/chain/specifications/link';
import Producer from '@/infrastructure/stream/producer';
import Amount from '@/domain/wallet/specifications/amount';
import Receiver from '@/domain/wallet/specifications/receiver';
import SameWallet from '@/domain/wallet/specifications/same-wallet';
import Sender from '@/domain/wallet/specifications/sender';
import TransactionPool from '@/domain/wallet/transaction-pool';
import BlockMined from '@/domain/chain/specifications/mined';

// Abstract class are mocked differently then normal classes
const emitter = {
  register: vi.fn()
};
const consumer = {
  run: vi.fn(),
  connect: vi.fn()
};
vi.mock('@/app/events/abstract-emitter', () => {
  return {
    __esModule: true,
    default: class {
      register = vi.fn();
      constructor() {
        Object.assign(this, emitter);
      }
    }
  };
});

vi.mock('@/infrastructure/stream/consumer', () => {
  return {
    __esModule: true,
    default: class {
      run = vi.fn();
      connect = vi.fn();
      constructor() {
        Object.assign(this, consumer);
      }
    }
  };
});
// End abstract class mocks

vi.mock('@/domain/wallet/transaction-pool');
vi.mock('@/domain/chain/blockchain');
vi.mock('@/infrastructure/database');
vi.mock('@/infrastructure/stream/producer');
vi.mock('@/app/routes/transaction');
vi.mock('@/app/server');

describe('Main', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  test('it expects events to be registered', () => {
    const application = new Application();

    application.registerEvents();

    expect(emitter.register).toHaveBeenCalledTimes(1);
    expect(emitter.register).toHaveBeenCalledWith(
      'TransactionAdded',
      expect.any(Function)
    );
  });

  test('it expects specifications added', () => {
    const application = new Application();
    const pool = vi.mocked(TransactionPool).mock.instances[0];
    const chain = vi.mocked(Blockchain).mock.instances[0];

    application.init();

    expect(pool.addSpecification).toHaveBeenCalledWith(
      expect.any(Amount),
      expect.any(Receiver),
      expect.any(Sender),
      expect.any(SameWallet)
    );
    expect(chain.addSpecification).toHaveBeenCalledTimes(1);
    expect(chain.addSpecification).toHaveBeenCalledWith(
      expect.any(Link),
      expect.any(BlockMined)
    );
  });

  test('it expects connections for database, producer, and consumer', async () => {
    const application = new Application();
    const database = vi.mocked(Database).mock.instances[0];
    const producer = vi.mocked(Producer).mock.instances[0];

    await application.boot();

    expect(database.connect).toHaveBeenCalled();
    expect(producer.connect).toHaveBeenCalled();
    expect(consumer.connect).toHaveBeenCalled();
    expect(consumer.run).toHaveBeenCalled();
  });

  test('it expects routes to be registered', () => {
    const application = new Application();
    const server = vi.mocked(Server).mock.instances[0];
    vi.mocked(TransactionRoute.getName).mockImplementation(() => 'test');

    application.registerRoutes();

    expect(server.post).toHaveBeenCalledWith('test', expect.any(Array));
  });
});
