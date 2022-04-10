import { Producer as KafkaProducer } from 'kafkajs';
import Stream from './stream';
import Transaction from '../wallet/transaction';
import Topic from './topic/topic';

export default class Producer {
  private producer: KafkaProducer;

  public constructor(stream: Stream) {
    this.producer = stream.createProducer();
  }

  public connect() : void {
    this.producer.connect();
  }

  public send(topic: string, transaction: Transaction) : void {
    this.producer.send({
      topic: Topic.new(topic).toString(),
      messages: [
        { key: transaction.getKey(), value: JSON.stringify(transaction) },
      ],
    });
  }
}
