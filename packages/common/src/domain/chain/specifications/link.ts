import Block from '../block.js';
import Specification from './specifications.js';

export default class Link implements Specification {
  private message = 'Incorrect block reference.';

  public isSatisfiedBy(prevous: Block, current: Block): void {
    if (prevous.getHash() !== current.getPreviousHash()) {
      throw new Error(this.message);
    }
  }
}
