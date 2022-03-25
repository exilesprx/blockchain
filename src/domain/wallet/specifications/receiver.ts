import Transaction from '../transaction';
import Specification from './specification';

export default class Receiver implements Specification {
  private message = 'Receiver not allowed.';

  public isSatisfiedBy(transaction: Transaction): boolean {
    if (typeof transaction.getReceiver() !== 'string') {
      throw new Error(this.message);
    }
    return true;
  }
}
