import { Transaction } from '../src/infrastructure/database/models/transaction';

describe('Transaction Translator', () => {
  test('it expects translator test', () => {
    const t = {
      id: 'one',
      to: 'me',
      from: 'you',
      amount: 123,
      date: Date.now(),
      hash: 'abc123',
    };
    const message: Transaction = JSON.parse(JSON.stringify(t));

    const b: Transaction = JSON.parse(JSON.stringify(t));
    expect(b.amount).toBe(123);
    expect(b.date).toBe(1);
    expect(message.amount).toBe(b.amount);
  });
});
