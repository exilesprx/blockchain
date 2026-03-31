import Transaction from '@blockchain/common/domain/wallet/transaction';
import Specification from '@blockchain/common/domain/wallet/specifications/specification';

export default class SameWallet implements Specification {
  private message = 'Cannot send to same wallet';

  public isSatisfiedBy(transaction: Transaction): void {
    if (transaction.getSender() === transaction.getReceiver()) {
      throw new Error(this.message);
    }
  }
}
