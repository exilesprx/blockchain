import { Transaction } from "../src/infrastructure/database/models/transaction";

describe('Transaction Translator', () => {
  test('it expects translator test', () => {
    const t = {
      id: "one",
      to: "me",
      from: "you",
      amount: 123,
      date: Date.now(),
      hash: "abc123"
    };
    const message: {
      id: any,
      to: string,
      from: string,
      amount: number,
      date: number,
      hash: string,
    } = JSON.parse(JSON.stringify(t));
    
    const b: Transaction = JSON.parse(JSON.stringify(t));
    expect(b.amount).toBe(123);
    expect(b.date).toBe(1);
  });
});
