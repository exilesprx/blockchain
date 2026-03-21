import Topic from './topic.js';

export default class Transaction extends Topic {
  public constructor() {
    super('transaction-added');
  }
}
