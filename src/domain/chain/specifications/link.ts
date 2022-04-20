import Block from '../block';
import Specification from './specifications';

export default class Link implements Specification {
  private message = 'Incorrect block reference.';

  public isSatisfiedBy(prevous: Block, current: Block): void {
    if (prevous.getHash() !== current.getPreviousHash()) {
      throw new Error(this.message);
    }
  }
}
