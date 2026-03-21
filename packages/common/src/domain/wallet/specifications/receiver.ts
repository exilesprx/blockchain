import Transaction from '../transaction.js';
import Specification from './specification.js';

export default class Receiver implements Specification {
  private message = 'Receiver not allowed.';

  public isSatisfiedBy(transaction: Transaction): void {
    if (transaction.getReceiver() == transaction.getSender()) {
      throw new Error(this.message);
    }
  }
}
