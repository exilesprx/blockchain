import { EachMessagePayload } from 'kafkajs';
import AddBlock from '../../app/commands/add-block';
import Consumer from './consumer';
import Stream from './stream';
import BlockTopic from './topic/block';
import BlockTranslator from './translators/block-translator';

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

    const block = BlockTranslator.toBlock(value);

    this.action.execute(block);
  }
}
