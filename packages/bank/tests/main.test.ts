import { beforeAll, describe, expect, vi, test } from 'vitest';

import Application from '../src/main';
import TransactionRoute from '../src/routes/transaction';
import Server from '../src/server/index';
import Database from '@blockchain/common/infrastructure/database';
import Blockchain from '@blockchain/common/domain/chain/blockchain';
import Link from '@blockchain/common/domain/chain/specifications/link';
import Producer from '@blockchain/common/infrastructure/stream/producer';
import Amount from '@blockchain/common/domain/wallet/specifications/amount';
import Receiver from '@blockchain/common/domain/wallet/specifications/receiver';
import SameWallet from '@blockchain/common/domain/wallet/specifications/same-wallet';
import Sender from '@blockchain/common/domain/wallet/specifications/sender';
import TransactionPool from '@blockchain/common/domain/wallet/transaction-pool';
import BlockMined from '@blockchain/common/domain/chain/specifications/mined';

// Abstract class are mocked differently then normal classes
const emitter = {
  register: vi.fn()
};
const consumer = {
  run: vi.fn(),
  connect: vi.fn()
};
vi.mock('@blockchain/common/events/abstract-emitter', () => {
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

vi.mock('@blockchain/common/infrastructure/stream/consumer', () => {
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

vi.mock('@blockchain/common/domain/wallet/transaction-pool');
vi.mock('@blockchain/common/domain/chain/blockchain');
vi.mock('@blockchain/common/infrastructure/database');
vi.mock('@blockchain/common/infrastructure/stream/producer');
vi.mock('../src/routes/transaction');
vi.mock('../src/server/index');

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
