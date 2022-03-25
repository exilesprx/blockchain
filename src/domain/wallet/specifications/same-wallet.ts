import Transaction from '../transaction';
import Specification from './specification';

export default class SameWallet implements Specification {
  private message = 'Cannot send to same wallet';

  public isSatisfiedBy(transaction: Transaction): boolean {
    if (transaction.getSender() === transaction.getReceiver()) {
      throw new Error(this.message);
    }
    return true;
  }
}
