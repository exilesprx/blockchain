import { Producer as KafkaProducer } from 'kafkajs';
import Block from '../../domain/chain/block';
import Transaction from '../../domain/wallet/transaction';
import Stream from './stream';
import BlockTopic from './topic/block';
import TransactionTopic from './topic/transaction';

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
      topic: new TransactionTopic().toString(),
      messages: [
        { key: transaction.getKey(), value: JSON.stringify(transaction) },
      ],
    });
  }

  public sendBlock(block: Block) : void {
    this.producer.send({
      topic: new BlockTopic().toString(),
      messages: [
        { key: block.getKey(), value: JSON.stringify(block) },
      ],
    });
  }
}
