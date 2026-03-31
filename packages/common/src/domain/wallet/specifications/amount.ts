import Transaction from '@blockchain/common/domain/wallet/transaction';
import Specification from '@blockchain/common/domain/wallet/specifications/specification';

export default class Amount implements Specification {
  private message = 'Amount not allowed.';

  public isSatisfiedBy(transaction: Transaction): void {
    if (!(transaction.getAmount() > 0)) {
      throw new Error(this.message);
    }
  }
}
