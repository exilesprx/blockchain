import Transaction from '@blockchain/common/domain/wallet/transaction';
import { Transaction as TransactionContract } from '@blockchain/common/infrastructure/database/models/transaction';
import Event from '@blockchain/common/domain/events/event';

export default class TransactionAdded extends Event {
  private id: any;
  private to: string;
  private from: string;
  private amount: number;
  private date: number;
  private hash: string;

  public constructor(transaction: Transaction) {
    super();

    this.id = transaction.getKey();
    this.to = transaction.getReceiver();
    this.from = transaction.getSender();
    this.date = transaction.getDate();
    this.amount = transaction.getAmount();
    this.hash = transaction.getHash();
  }

  public toJson(): TransactionContract {
    return {
      id: this.id,
      to: this.to,
      from: this.from,
      amount: this.amount,
      date: this.date,
      hash: this.hash
    };
  }
}
