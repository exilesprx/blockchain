export default class TransactionDataTransferObject {
  private to: string;

  private from: string;

  private amount: number;

  constructor(to: string, from: string, amount: number) {
    this.to = to;
    this.from = from;
    this.amount = amount;
  }

  public destruct(): { to: string; from: string; amount: number; } {
    return {
      to: this.to,
      from: this.from,
      amount: this.amount,
    };
  }
}
