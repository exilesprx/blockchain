import Topic from '@blockchain/common/infrastructure/stream/topic/topic';

export default class Transaction extends Topic {
  static readonly NAME = 'transaction-added';

  public constructor() {
    super(Transaction.NAME);
  }
}
