import BlockState from '@blockchain/common/domain/chain/state/block-state';

export default class Unmined implements BlockState {
  public isMined(): boolean {
    return false;
  }
}
