import Transaction from '../transaction';
import Specification from './specification';

export default class SameWallet implements Specification {
  isSatisfiedBy(transaction: Transaction): boolean {
    if (transaction.getSender() == transaction.getReceiver()) {
      throw new Error('Cannot send to same wallet');
    }
    return true;
  }
}
