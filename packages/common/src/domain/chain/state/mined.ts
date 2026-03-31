import BlockState from '@blockchain/common/domain/chain/state/block-state';

export default class Mined implements BlockState {
  public static sameInstance(state: BlockState): boolean {
    return state instanceof Mined;
  }
}
