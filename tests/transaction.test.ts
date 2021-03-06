import { v4 } from 'uuid';
import TransactionTranslator from '../src/app/translators/transaction-translator';
import Transaction from '../src/domain/wallet/transaction';
import data from './stubs/transaction.json';

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

  test('it expects to translate a consumer message into transactions', () => {
    const transaction = TransactionTranslator.fromObject(data);

    expect(transaction).toBeInstanceOf(Transaction);

    expect(transaction.getHash()).toBe(data.hash);

    expect(transaction.getDate()).toBe(data.date);

    expect(transaction.getKey()).toBe(data.id);
  });
});
