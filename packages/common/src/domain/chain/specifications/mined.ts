import Block from '@blockchain/common/domain/chain/block';
import Specification from '@blockchain/common/domain/chain/specifications/specifications';

export default class BlockMined implements Specification {
  private message = 'Block is not mined.';

  public isSatisfiedBy(prevous: Block, current: Block): void {
    if (!current.isMined()) {
      throw new Error(this.message);
    }
  }
}
