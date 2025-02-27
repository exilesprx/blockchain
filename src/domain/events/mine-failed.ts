import Block from '../chain/block';
import Event from './event';

export default class MineFailed extends Event {
  private id: any;
  private err: any;

  public constructor(block: Block, error: any) {
    super();

    this.id = block.getKey();
    this.err = error;
  }

  public error(): string {
    return this.err;
  }

  public toJson() {
    return {
      id: this.id
    };
  }
}
