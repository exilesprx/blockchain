import { EachMessagePayload } from 'kafkajs';
import AddBlockFromConsumer from '@blockchain/common/commands/add-block-from-consumer';
import Consumer from '@blockchain/common/infrastructure/stream/consumer';
import Stream from '@blockchain/common/infrastructure/stream/stream';
import BlockTopic from '@blockchain/common/infrastructure/stream/topic/block';
import BlockTranslator from '@blockchain/common/infrastructure/stream/translators/block-translator';

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
