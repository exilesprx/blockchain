import Block from '../block';
import Specification from './specifications';

export default class Mined implements Specification {
  private message = 'Block is not mined.';

  public isSatisfiedBy(prevous: Block, current: Block): void {
    if (!current.isMined()) {
      throw new Error(this.message);
    }
  }
}
