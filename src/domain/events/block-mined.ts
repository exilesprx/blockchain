import Event from './event';

export default class BlockMined extends Event {
  public constructor() {
    super('block-mined');
  }
}
