import Transaction from '@blockchain/common/domain/wallet/transaction';
import Specification from '@blockchain/common/domain/wallet/specifications/specification';

export default class Sender implements Specification {
  private message = 'Sender not allowed';

  public isSatisfiedBy(transaction: Transaction): void {
    if (transaction.getReceiver() == transaction.getSender()) {
      throw new Error(this.message);
    }
  }
}
