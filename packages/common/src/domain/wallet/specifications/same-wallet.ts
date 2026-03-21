import Transaction from '../transaction.js';
import Specification from './specification.js';

export default class SameWallet implements Specification {
  private message = 'Cannot send to same wallet';

  public isSatisfiedBy(transaction: Transaction): void {
    if (transaction.getSender() === transaction.getReceiver()) {
      throw new Error(this.message);
    }
  }
}
