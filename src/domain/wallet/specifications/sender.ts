import Transaction from '../transaction';
import Specification from './specification';

export default class Sender implements Specification {
  private message = 'Sender not allowed';

  public isSatisfiedBy(transaction: Transaction): boolean {
    if (typeof transaction.getSender() !== 'string') {
      throw new Error(this.message);
    }
    return true;
  }
}
