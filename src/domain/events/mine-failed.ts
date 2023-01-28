import Event from './event';

export default class MineFailed extends Event {
  public constructor() {
    super();
  }

  // eslint-disable-next-line class-methods-use-this
  public toJson() {
    return {};
  }
}
