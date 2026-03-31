import { describe, expect, test } from 'vitest';

import TransactionStreamTranslator from '@/infrastructure/stream/translators/transaction-stream-translator';
import stringify from 'fast-json-stable-stringify';
import data from './stubs/transaction.json';

describe('Transaction Consumer Translator', () => {
  test('it expects to translate a buffer into a transaction', () => {
    const buffer = Buffer.from(stringify(data));
    const transaction = TransactionStreamTranslator.fromMessage(buffer);

    expect(transaction.getHash()).not.toBe(data.hash);
  });
});
