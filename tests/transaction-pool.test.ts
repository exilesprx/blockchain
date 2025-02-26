import { describe, expect, jest, test } from '@jest/globals';

import { v4 } from 'uuid';
import Amount from '../src/domain/wallet/specifications/amount';
import Transaction from '../src/domain/wallet/transaction';
import TransactionPool from '../src/domain/wallet/transaction-pool';

jest.mock('../src/app/events/abstract-emitter');

describe('Transaction pool', () => {
  test('it expects the pool to be empty when initialized', () => {
    const pool = new TransactionPool();

    expect(pool.isEmpty()).toBeTruthy();
  });

  test('it expects a valid transaction is added to the pool', () => {
    const pool = new TransactionPool();
    const transaction = new Transaction(v4(), 'to', 'from', 2, 0);

    pool.addSpecification(new Amount());
    pool.fill(transaction);
    const events = pool.flushEvents();

    expect(events.length).toBe(1);
    expect(pool.isEmpty()).toBeFalsy();
  });

  test('it expects an invalid transaction is not added to the pool', () => {
    const pool = new TransactionPool();
    const transaction = new Transaction(v4(), 'to', 'from', 0, 0);

    pool.addSpecification(new Amount());

    expect(() => pool.fill(transaction)).toThrow();
  });

  test('it expects the pool to be empty after flushing', () => {
    const pool = new TransactionPool();
    pool.fill(new Transaction(v4(), 'to', 'from', 2, 0));
    pool.fill(new Transaction(v4(), 'to', 'from', 2, 0));

    expect(pool.isEmpty()).toBe(false);

    pool.flush();
    expect(pool.isEmpty()).toBe(true);
  });

  test('it expects the ability to add multiple specifications at once', () => {
    const pool = new TransactionPool();
    const transaction = new Transaction(v4(), 'to', 'from', 5, 0);
    const amountSpec = new Amount();
    const isSatisfiedBy = jest
      .spyOn(amountSpec, 'isSatisfiedBy')
      .mockImplementation(() => true);

    pool.addSpecification(amountSpec, amountSpec, amountSpec);
    pool.fill(transaction);

    expect(isSatisfiedBy).toHaveBeenCalledTimes(3);
  });
});
