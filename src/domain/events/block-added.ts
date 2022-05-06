import Event from './event';

export default class BlockAdded extends Event {
  public constructor() {
    super('block-added');
  }
}
