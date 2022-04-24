import { Producer as KafkaProducer } from 'kafkajs';
import Block from '../chain/block';
import Transaction from '../wallet/transaction';
import Stream from './stream';
import Topic from './topic/topic';

export default class Producer {
  private producer: KafkaProducer;

  public constructor(stream: Stream) {
    this.producer = stream.createProducer();
  }

  public async connect() : Promise<void> {
    this.producer.connect();
  }

  public sendTransaction(transaction: Transaction) : void {
    this.producer.send({
      topic: Topic.new('transaction-added').toString(),
      messages: [
        { key: transaction.getKey(), value: JSON.stringify(transaction) },
      ],
    });
  }

  public sendBlock(block: Block) : void {
    this.producer.send({
      topic: Topic.new('block-add').toString(),
      messages: [
        { key: block.getKey(), value: JSON.stringify(block) },
      ],
    });
  }
}
