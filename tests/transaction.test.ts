import { v4 } from 'uuid';
import Transaction from '../src/domain/wallet/transaction';

describe('Transactions', () => {
  test('it expect to have a valid transaction', () => {
    const transaction = new Transaction(v4(), 'one', 'two', 30, 0);

    expect(transaction.getReceiver()).toBe('one');
    expect(transaction.getSender()).toBe('two');
    expect(transaction.getAmount()).toBe(30);
  });

  test('it expects a transaction can occur between different wallets', () => {
    const transaction = new Transaction(v4(), 'one', 'two', 20, 0);

    expect(transaction.getHash()).not.toBeNull();
  });

  test('it expects a transaction should not fail using the same wallet', () => {
    expect(() => new Transaction(v4(), 'one', 'one', 20, 0)).not.toThrow(TypeError);
  });
});
