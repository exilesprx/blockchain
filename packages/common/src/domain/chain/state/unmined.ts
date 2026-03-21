import BlockState from './block-state.js';

export default class Unmined implements BlockState {
  public static sameInstance(state: BlockState): boolean {
    return state instanceof Unmined;
  }
}
