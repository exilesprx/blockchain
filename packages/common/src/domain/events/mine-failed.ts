import Block from '@blockchain/common/domain/chain/block';
import Event from '@blockchain/common/domain/events/event';

export default class MineFailed extends Event {
  private id: string;
  private err: string;

  public constructor(block: Block, error: unknown) {
    super();

    this.id = block.getKey();
    this.err = error instanceof Error ? error.message : String(error);
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
