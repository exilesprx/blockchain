import { describe, expect, jest, test } from '@jest/globals';

import { H3Event, readBody } from 'h3';
import TransactionRoute from '../src/app/routes/transaction';
import Logger from '../src/infrastructure/logs/logger';
import AddTransactionFromRequest from '../src/app/commands/add-transaction-from-request';
import TransactionPool from '../src/domain/wallet/transaction-pool';
import TransactionEventRepository from '../src/infrastructure/repositories/transaction-events';

jest.mock('h3', () => ({
  readBody: jest.fn(),
  setResponseStatus: jest.fn()
}));
jest.mock('../src/infrastructure/database/index');
jest.mock('../src/infrastructure/logs/logger');
jest.mock('../src/app/commands/add-transaction-from-request');

describe('Transaction route', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('it expects to add a transition to the bank and persist it', async () => {
    const action = new AddTransactionFromRequest(
      {} as TransactionPool,
      {} as TransactionEventRepository
    );
    const execute = jest.spyOn(action, 'execute');
    const route = new TransactionRoute(action, {} as Logger);
    const event = { req: { method: 'POST' } } as H3Event;
    (readBody as jest.Mock).mockImplementationOnce(() =>
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
    const execute = jest.spyOn(action, 'execute').mockImplementation(() => {
      throw new Error('some');
    });
    const logger = new Logger([]);
    const err = jest.spyOn(logger, 'error');
    const route = new TransactionRoute(action, logger);
    const event = { req: { method: 'POST' } } as H3Event;
    (readBody as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ to: 'someone' })
    );

    expect(await route.getAction(event)).not.toHaveProperty('message');
    expect(execute).not.toHaveBeenCalled();
    expect(err).toHaveBeenCalled();
  });
});
