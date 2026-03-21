import { describe, expect, test } from 'vitest';

import ConsumerTransactionTranslator from '@/infrastructure/stream/translators/transaction-translator';
import stringify from 'fast-json-stable-stringify';
import data from './stubs/transaction.json';

describe('Transaction Consumer Translator', () => {
  test('it expects to translate a buffer into a transaction', () => {
    const buffer = Buffer.from(stringify(data));
    const transaction = ConsumerTransactionTranslator.fromMessage(buffer);

    expect(transaction.getHash()).not.toBe(data.hash);
  });
});
