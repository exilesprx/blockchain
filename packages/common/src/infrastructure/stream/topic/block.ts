import Topic from './topic.js';

export default class Block extends Topic {
  public constructor() {
    super('block-added');
  }
}
