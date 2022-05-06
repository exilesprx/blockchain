import { EachMessagePayload } from 'kafkajs';
import AddBlock from '../../app/commands/add-block';
import Block from '../../domain/chain/block';
import Consumer from './consumer';
import Stream from './stream';
import BlockTopic from './topic/block';

export default class BlockConsumer extends Consumer {
  private action: AddBlock;

  public constructor(action: AddBlock, stream: Stream) {
    super(stream);

    this.action = action;
  }

  public async run() : Promise<void> {
    super.run(new BlockTopic().toString());
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
