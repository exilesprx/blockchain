import Specification from './specifications/specification';
import Transaction from './transaction';

export default class TransactionPool {
  private specifications: Specification[];

  private transactions: Transaction[];

  constructor() {
    this.specifications = [];

    this.transactions = [];
  }

  public fill(transaction: Transaction) : void {
    this.specifications.forEach((spec: Specification) => {
      spec.isSatisfiedBy(transaction);
    });

    this.transactions.push(transaction);
  }

  public addSpecification(...specification: Specification[]) : void {
    this.specifications.push(...specification);
  }

  public isEmpty() : boolean {
    return this.transactions.length === 0;
  }
}
