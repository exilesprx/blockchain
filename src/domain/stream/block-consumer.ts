import { EachMessagePayload } from 'kafkajs';
import AddBlock from '../../app/actions/add-block';
import Block from '../chain/block';
import Consumer from './consumer';
import Stream from './stream';
import Topic from './topic/topic';

export default class BlockConsumer extends Consumer {
  private action: AddBlock;

  public constructor(action: AddBlock, stream: Stream) {
    super(stream);

    this.action = action;
  }

  public async run() : Promise<void> {
    super.run(Topic.new('block-added').toString());
  }

  protected async transformMessage(payload: EachMessagePayload) : Promise<void> {
    const { value } = payload.message;

    if (!value) {
      return;
    }

    const parts: any = value.toJSON();

    const block = new Block(
      parts.id,
      parts.nounce,
      parts.difficulty,
      parts.previousHash,
      parts.transactions,
    );

    this.action.execute(block);
  }
}
