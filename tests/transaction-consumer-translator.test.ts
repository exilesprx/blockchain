import ConsumerTransactionTranslator from '../src/infrastructure/stream/translators/transaction-translator';
import data from './stubs/transaction.json';

describe('Transaction Consumer Translator', () => {
  test('it expects to translate a buffer into a transaction', () => {
    const buffer = Buffer.from(JSON.stringify(data));
    const transaction = ConsumerTransactionTranslator.fromMessage(buffer);
    expect(transaction.getHash()).not.toBe(data.hash);
  });
});
