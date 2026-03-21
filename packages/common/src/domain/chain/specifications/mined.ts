import Block from '../block.js';
import Specification from './specifications.js';

export default class BlockMined implements Specification {
  private message = 'Block is not mined.';

  public isSatisfiedBy(prevous: Block, current: Block): void {
    if (!current.isMined()) {
      throw new Error(this.message);
    }
  }
}
