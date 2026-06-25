import { Producer as KafkaProducer } from 'kafkajs';
import Stream from '@blockchain/common/infrastructure/stream/stream';
import BlockTopic from '@blockchain/common/infrastructure/stream/topic/block';
import TransactionTopic from '@blockchain/common/infrastructure/stream/topic/transaction';
import { Block as BlockContract } from '@blockchain/common/infrastructure/database/models/block';
import { Transaction as TransactionContract } from '@blockchain/common/infrastructure/database/models/transaction';
import stringify from 'fast-json-stable-stringify';

export default class Producer {
  private producer: KafkaProducer;

  public constructor(stream: Stream) {
    this.producer = stream.createProducer();
  }

  public async connect(): Promise<void> {
    await this.producer.connect();
  }

  public async sendTransaction(transaction: TransactionContract): Promise<void> {
    await this.producer.send({
      topic: new TransactionTopic().toString(),
      messages: [{ key: transaction.id, value: stringify(transaction) }]
    });
  }

  public async sendBlock(block: BlockContract): Promise<void> {
    await this.producer.send({
      topic: new BlockTopic().toString(),
      messages: [{ key: block.id, value: stringify(block) }]
    });
  }
}
