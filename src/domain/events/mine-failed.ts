import Event from './event';

export default class MineFailed extends Event {
  public constructor() {
    super('mine-failed');
  }
}
