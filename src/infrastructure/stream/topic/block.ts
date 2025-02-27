import Topic from './topic';

export default class Block extends Topic {
  public constructor() {
    super('block-added');
  }
}
