import { describe, expect, vi, test } from 'vitest';

import { v4 } from 'uuid';
import Transaction from '@/domain/wallet/transaction';
import TransactionPool from '@/domain/wallet/transaction-pool';
import TransactionEventRepository from '@/infrastructure/repositories/transaction-events';
import TransactionRepository from '@/infrastructure/repositories/transaction';
import Database from '@/infrastructure/database';
import TransactionAdded from '@/domain/events/transaction-added';

vi.mock('@/infrastructure/database');

describe('Transaction repository test', () => {
  test('it persists the data and dispatches events', async () => {
    const database = new Database('', 0, false);
    const persist = vi.spyOn(database, 'persist').mockResolvedValue(undefined);
    const emitter = { emit: vi.fn() };
    const repo = new TransactionRepository(database);
    const eventRepo = new TransactionEventRepository(emitter as never, repo);
    const pool = new TransactionPool();
    const transaction = new Transaction(v4(), 'to', 'from', 10, Date.now());

    pool.fill(transaction);
    await eventRepo.persist(pool);

    expect(persist).toHaveBeenCalled();
    expect(emitter.emit).toHaveBeenCalledWith(
      TransactionAdded.toString(),
      expect.objectContaining({ id: transaction.getKey() })
    );
  });
});
