import { describe, expect, test } from '@jest/globals';

import ConsumerTransactionTranslator from '../src/infrastructure/stream/translators/transaction-translator';
import stringify from 'fast-json-stable-stringify';
import data from './stubs/transaction.json';

describe('Transaction Consumer Translator', () => {
  test('it expects to translate a buffer into a transaction', () => {
    const buffer = Buffer.from(stringify(data));
    const transaction = ConsumerTransactionTranslator.fromMessage(buffer);

    expect(transaction.getHash()).not.toBe(data.hash);
  });
});
