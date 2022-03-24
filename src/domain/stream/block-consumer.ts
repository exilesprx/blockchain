import { EachMessagePayload } from 'kafkajs';
import Block from '../chain/block';
import Consumer from './consumer';

export default class BlockConsumer extends Consumer {
  public async run(topic: string) : Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });
    await this.consumer.run(
      {
        eachMessage: this.emitBlockAdded,
      },
    );
  }

  protected async emitBlockAdded(payload: EachMessagePayload) : Promise<void> {
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

    this.bank.addBlock(block);

    this.database.persistBlock(block);
  }
}
