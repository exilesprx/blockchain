import TransactionTranslator from '../src/app/translators/transaction-translator';
import Transaction from '../src/domain/wallet/transaction';
import data from './stubs/transaction.json';

describe('Transaction Translator', () => {
  test('it expects to translate an object into a Transaction', () => {
    const transaction = TransactionTranslator.fromObject(data);
    expect(transaction.getHash()).not.toBe(data.hash);
    expect(transaction).toBeInstanceOf(Transaction);
  });

  test('it expects to translate a buffer into a transaction', () => {
    const buffer = Buffer.from(JSON.stringify(data));
    const transaction = TransactionTranslator.fromMessage(buffer);
    expect(transaction.getHash()).not.toBe(data.hash);
  });

  test('it expects to translate an array of transactions', () => {
    const transactions = [data, data];
    const convertedTransactions = TransactionTranslator.fromObjectForMany(transactions);
    convertedTransactions.forEach((transaction: Transaction) => {
      expect(transaction.getHash()).not.toBe(data.hash);
    });
  });
  
  test('it expects transaction properties to match values parsed', () => {
    const transaction = TransactionTranslator.fromObject(data);
    expect(transaction).toBeInstanceOf(Transaction);
    expect(transaction.getSender()).toBe(data.from);
    expect(transaction.getReceiver()).toBe(data.to);
    expect(transaction.getKey()).toBe(data.id);
    expect(transaction.getDate()).toBe(data.date);
    expect(transaction.getAmount()).toBe(data.amount);
  })
});
