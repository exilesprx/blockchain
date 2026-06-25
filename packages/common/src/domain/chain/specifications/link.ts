import Block from '@blockchain/common/domain/chain/block';
import Specification from '@blockchain/common/domain/chain/specifications/specifications';

export default class Link implements Specification {
  private message = 'Incorrect block reference.';

  public isSatisfiedBy(previous: Block, current: Block): void {
    if (previous.getHash() !== current.getPreviousHash()) {
      throw new Error(this.message);
    }
  }
}
