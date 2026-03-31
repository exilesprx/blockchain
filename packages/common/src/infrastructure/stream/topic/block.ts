import Topic from '@blockchain/common/infrastructure/stream/topic/topic';

export default class Block extends Topic {
  public constructor() {
    super('block-added');
  }
}
