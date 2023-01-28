import Block from '../chain/block';
import Event from './event';

export default class MineFailed extends Event {
  private id: any;

  public constructor(block: Block) {
    super();
    
    this.id = block.getKey();
  }

  public toJson() {
    return {
      id: this.id
    };
  }
}
