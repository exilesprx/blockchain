import Transaction from '../wallet/transaction';
import { Transaction as TransactionContract } from '../../infrastructure/database/models/transaction';
import Event from './event';

export default class TransactionAdded extends Event {
  private id;
  private to;
  private from;
  private amount;
  private date;
  private hash;
  
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
