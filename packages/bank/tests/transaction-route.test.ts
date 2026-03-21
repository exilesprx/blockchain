import { describe, expect, vi, test, beforeAll } from 'vitest';

import { H3Event, readBody } from 'h3';
import TransactionRoute from '@/routes/transaction';
import Logger from '@blockchain/common/infrastructure/logs/logger';
import AddTransactionFromRequest from '@blockchain/common/commands/add-transaction-from-request';
import TransactionPool from '@blockchain/common/domain/wallet/transaction-pool';
import TransactionEventRepository from '@blockchain/common/infrastructure/repositories/transaction-events';

vi.mock('h3', () => ({
  readBody: vi.fn(),
  setResponseStatus: vi.fn()
}));
vi.mock('@blockchain/common/infrastructure/database/index');
vi.mock('@blockchain/common/infrastructure/logs/logger');
vi.mock('@blockchain/common/commands/add-transaction-from-request');

describe('Transaction route', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  test('it expects to add a transition to the bank and persist it', async () => {
    const action = new AddTransactionFromRequest(
      {} as TransactionPool,
      {} as TransactionEventRepository
    );
    const execute = vi.spyOn(action, 'execute');
    const route = new TransactionRoute(action, {} as Logger);
    const event = { req: { method: 'POST' } } as H3Event;
    (readBody as vi.Mock).mockImplementationOnce(() =>
      Promise.resolve({ to: 'someone', from: 'someone-else', amount: 10 })
    );

    expect(await route.getAction(event)).toHaveProperty('message');
    expect(execute).toHaveBeenCalled();
  });

  test('it expects to send a 400 response when request is missing data', async () => {
    const action = new AddTransactionFromRequest(
      {} as TransactionPool,
      {} as TransactionEventRepository
    );
    const execute = vi.spyOn(action, 'execute').mockImplementation(() => {
      throw new Error('some');
    });
    const logger = new Logger([]);
    const err = vi.spyOn(logger, 'error');
    const route = new TransactionRoute(action, logger);
    const event = { req: { method: 'POST' } } as H3Event;
    (readBody as vi.Mock).mockImplementationOnce(() =>
      Promise.resolve({ to: 'someone' })
    );

    expect(await route.getAction(event)).not.toHaveProperty('message');
    expect(execute).not.toHaveBeenCalled();
    expect(err).toHaveBeenCalled();
  });
});
