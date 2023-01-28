import Emitter from '../../app/events/emitter';
import TransactionAdded from '../events/transaction-added';
import NewBlockPolicy from '../policies/new-block-policy';
import Specification from './specifications/specification';
import Transaction from './transaction';

export default class TransactionPool {
  private emitter: Emitter;

  private specifications: Specification[];

  private transactions: Transaction[];

  public constructor(emitter: Emitter) {
    this.emitter = emitter;

    this.specifications = [];

    this.transactions = [];
  }

  public fill(transaction: Transaction) : void {
    this.specifications.forEach((spec: Specification) => {
      spec.isSatisfiedBy(transaction);
    });

    this.transactions.push(transaction);

    this.emitter.emit(new TransactionAdded().toString(), transaction);
  }

  public addSpecification(...specification: Specification[]) : void {
    this.specifications.push(...specification);
  }

  public isEmpty() : boolean {
    return this.transactions.length === 0;
  }

  public shouldCreateNewBlock() : boolean {
    return NewBlockPolicy.shouldCreateNewBlock(this.transactions);
  }

  public flush() : Transaction[] {
    const transactions: Transaction[] = [...this.transactions];

    this.transactions = [];

    return transactions;
  }
}
