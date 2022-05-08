import { EachMessagePayload } from 'kafkajs';
import AddBlock from '../../app/commands/add-block';
import BlockDataTransferObject from '../../app/data-transfer-objects/block';
import Transaction from '../../domain/wallet/transaction';
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

    const {
      id, nounce, difficulty, previousHash, transactions,
    } = JSON.parse(value.toString());

    // TODO: need to pass date and hash
    // TODO: need to convert transactions to objects
    const block = new BlockDataTransferObject(
      id,
      nounce,
      difficulty,
      previousHash,
      transactions,
    );

    this.action.execute(block);
  }
}
