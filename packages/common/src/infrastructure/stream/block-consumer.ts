import { EachMessagePayload } from 'kafkajs';
import AddBlockFromConsumer from '../../commands/add-block-from-consumer.js';
import Consumer from './consumer.js';
import Stream from './stream.js';
import BlockTopic from './topic/block.js';
import BlockTranslator from './translators/block-translator.js';

export default class BlockConsumer extends Consumer {
  private action: AddBlockFromConsumer;

  public constructor(action: AddBlockFromConsumer, stream: Stream) {
    super(stream);

    this.action = action;
  }

  public async run(): Promise<void> {
    super.run(new BlockTopic().toString());
  }

  protected async transformMessage(payload: EachMessagePayload): Promise<void> {
    const { value } = payload.message;
    if (!value) {
      return;
    }
    const block = BlockTranslator.fromMessage(value);

    this.action.execute(block);
  }
}
