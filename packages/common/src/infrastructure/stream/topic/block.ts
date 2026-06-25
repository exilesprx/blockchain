import Topic from '@blockchain/common/infrastructure/stream/topic/topic';

export default class Block extends Topic {
  static readonly NAME = 'block-added';

  public constructor() {
    super(Block.NAME);
  }
}
