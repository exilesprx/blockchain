import BlockState from './block-state.js';

export default class Mined implements BlockState {
  public static sameInstance(state: BlockState): boolean {
    return state instanceof Mined;
  }
}
