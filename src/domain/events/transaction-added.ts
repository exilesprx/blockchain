import Event from './event';

export default class TransactionAdded extends Event {
  public constructor() {
    super('transaction-added');
  }

  public toJson() {
    return {};
  }
}
