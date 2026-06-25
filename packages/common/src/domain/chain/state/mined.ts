import BlockState from '@blockchain/common/domain/chain/state/block-state';

export default class Mined implements BlockState {
  public isMined(): boolean {
    return true;
  }
}
