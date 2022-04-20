import Amount from '../src/domain/wallet/specifications/amount';
import Transaction from '../src/domain/wallet/transaction';
import TransactionPool from '../src/domain/wallet/transaction-pool';

describe('Transaction pool', () => {
  test('it expects the pool to be empty when initialized', () => {
    const pool = new TransactionPool();

    expect(pool.isEmpty()).toBeTruthy();
  });

  test('it expects a valid transaction is added to the pool', () => {
    const pool = new TransactionPool();

    const transaction = new Transaction('to', 'from', 2);

    pool.addSpecification(new Amount());

    pool.fill(transaction);

    expect(pool.isEmpty()).toBeFalsy();
  });

  test('it expects an invalid transaction is not added to the pool', () => {
    const pool = new TransactionPool();

    const transaction = new Transaction('to', 'from', 0);

    pool.addSpecification(new Amount());

    expect(() => pool.fill(transaction)).toThrow();
  });

  test('it expects the ability to add multiple specifications at once', () => {
    const pool = new TransactionPool();

    const transaction = new Transaction('to', 'from', 5);

    const amountSpec = new Amount();

    const spy = jest.spyOn(amountSpec, 'isSatisfiedBy')
      .mockReturnValue(true);

    pool.addSpecification(amountSpec, amountSpec, amountSpec);

    pool.fill(transaction);

    expect(spy).toBeCalledTimes(3);
  });
});
