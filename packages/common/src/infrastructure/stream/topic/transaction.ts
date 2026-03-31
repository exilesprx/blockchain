import Topic from '@blockchain/common/infrastructure/stream/topic/topic';

export default class Transaction extends Topic {
  public constructor() {
    super('transaction-added');
  }
}
