import Transaction from '../transaction.js';
import Specification from './specification.js';

export default class Amount implements Specification {
  private message = 'Amount not allowed.';

  public isSatisfiedBy(transaction: Transaction): void {
    if (!(transaction.getAmount() > 0)) {
      throw new Error(this.message);
    }
  }
}
