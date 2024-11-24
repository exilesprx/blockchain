import TransactionAdded from "../events/transaction-added";
import NewBlockPolicy from "../policies/new-block-policy";
import Specification from "./specifications/specification";
import Transaction from "./transaction";
import Event from "../events/event";

export default class TransactionPool {
  private events: Event[];
  private specifications: Specification[];
  private transactions: Transaction[];

  public constructor() {
    this.events = [];
    this.specifications = [];
    this.transactions = [];
  }

  public fill(transaction: Transaction): void {
    this.specifications.forEach((spec: Specification) => {
      spec.isSatisfiedBy(transaction);
    });
    this.transactions.push(transaction);
    this.events.push(new TransactionAdded(transaction));
  }

  public addSpecification(...specification: Specification[]): void {
    this.specifications.push(...specification);
  }

  public isEmpty(): boolean {
    return this.transactions.length === 0;
  }

  public shouldCreateNewBlock(): boolean {
    return NewBlockPolicy.shouldCreateNewBlock(this.transactions);
  }

  public flush(): Transaction[] {
    const transactions: Transaction[] = [...this.transactions];
    this.transactions = [];

    return transactions;
  }

  public lastTransaction(): Transaction {
    return this.transactions[this.transactions.length - 1];
  }

  public flushEvents() {
    return this.events.splice(0, this.events.length);
  }
}
