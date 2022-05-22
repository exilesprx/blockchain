import { v4 } from 'uuid';
import Emitter from '../src/domain/events/emitter';
import Amount from '../src/domain/wallet/specifications/amount';
import Transaction from '../src/domain/wallet/transaction';
import TransactionPool from '../src/domain/wallet/transaction-pool';

jest.mock('../src/domain/events/emitter');

describe('Transaction pool', () => {
  beforeAll(() => {
    Emitter.mockClear();
  });
  test('it expects the pool to be empty when initialized', () => {
    const pool = new TransactionPool(jest.fn());

    expect(pool.isEmpty()).toBeTruthy();
  });

  test('it expects a valid transaction is added to the pool', () => {
    const emitter = new Emitter(jest.fn(), jest.fn(), jest.fn());
    const pool = new TransactionPool(emitter);

    const transaction = new Transaction(v4(), 'to', 'from', 2, 0);

    pool.addSpecification(new Amount());

    pool.fill(transaction);

    expect(Emitter.mock.instances[0].emit).toBeCalled();

    expect(pool.isEmpty()).toBeFalsy();
  });

  test('it expects an invalid transaction is not added to the pool', () => {
    const pool = new TransactionPool(jest.fn());

    const transaction = new Transaction(v4(), 'to', 'from', 0, 0);

    pool.addSpecification(new Amount());

    expect(() => pool.fill(transaction)).toThrow();
  });

  test('it expects the ability to add multiple specifications at once', () => {
    const emitter = new Emitter(jest.fn(), jest.fn(), jest.fn());

    const pool = new TransactionPool(emitter);

    const transaction = new Transaction(v4(), 'to', 'from', 5, 0);

    const amountSpec = new Amount();

    const spy = jest.spyOn(amountSpec, 'isSatisfiedBy')
      .mockReturnValue(true);

    pool.addSpecification(amountSpec, amountSpec, amountSpec);

    pool.fill(transaction);

    expect(Emitter.mock.instances[0].emit).toBeCalled();

    expect(spy).toBeCalledTimes(3);
  });
});
