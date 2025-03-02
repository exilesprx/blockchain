import { Producer as KafkaProducer } from 'kafkajs';
import Stream from './stream';
import BlockTopic from './topic/block';
import TransactionTopic from './topic/transaction';
import { Block as BlockContract } from '../database/models/block';
import { Transaction as TransactionContract } from '../database/models/transaction';
import stringify from 'fast-json-stable-stringify';

export default class Producer {
  private producer: KafkaProducer;

  public constructor(stream: Stream) {
    this.producer = stream.createProducer();
  }

  public async connect(): Promise<void> {
    this.producer.connect();
  }

  public sendTransaction(transaction: TransactionContract): void {
    this.producer.send({
      topic: new TransactionTopic().toString(),
      messages: [{ key: transaction.id, value: stringify(transaction) }]
    });
  }

  public sendBlock(block: BlockContract): void {
    this.producer.send({
      topic: new BlockTopic().toString(),
      messages: [{ key: block.id, value: stringify(block) }]
    });
  }
}
