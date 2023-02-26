import TransactionTranslator from '../src/app/translators/transaction-translator';
import Transaction from '../src/domain/wallet/transaction';
import data from './stubs/transaction.json';

describe('Transaction Translator', () => {
  test('it expects to translate an object into a Transaction', () => {
    const transaction = TransactionTranslator.fromObject(data);
    expect(transaction.getHash()).not.toBe(data.hash);
    expect(transaction).toBeInstanceOf(Transaction);
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
  });

  test('it expects to translate to a transaction from a request body', () => {
    const request = { to: '123', from: '321', amount: 2 };
    const transaction = TransactionTranslator.fromRequest(request);
    expect(transaction.getAmount()).toBe(request.amount);
    expect(transaction.getSender()).toBe(request.from);
    expect(transaction.getReceiver()).toBe(request.to);
  });
});
