import TransactionTranslator from '../src/app/translators/transaction-translator';
import Transaction from '../src/domain/wallet/transaction';

describe('Transaction Translator', () => {
  test('it expects to translate an object into a Transaction', () => {
    const message = {
      id: 'one',
      to: 'me',
      from: 'you',
      amount: 123,
      date: Date.now(),
      hash: 'abc123',
    };

    const transaction = TransactionTranslator.fromObject(message);
    expect(transaction.getHash()).toBe('abc123');
    expect(transaction).toBeInstanceOf(Transaction);
  });

  test('it expects to translate a buffer into a transaction', () => {
    const message = {
      id: 'one',
      to: 'me',
      from: 'you',
      amount: 123,
      date: Date.now(),
      hash: 'abc123',
    };

    const buffer = Buffer.from(JSON.stringify(message));
    const transaction = TransactionTranslator.fromMessage(buffer);
    expect(transaction.getAmount).toBe(123);
  });
});
