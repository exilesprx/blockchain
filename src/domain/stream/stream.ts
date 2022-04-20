import { Consumer, Kafka, Producer } from 'kafkajs';
import KafkaLogger from '../logs/kafka-logger';

export default class Stream {
  private kafka: Kafka;

  public constructor(kafkaLogger: KafkaLogger) {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
      logCreator: () => kafkaLogger.logCreator,
    });
  }

  public createProducer() : Producer {
    return this.kafka.producer();
  }

  public createConsumer(group: string) :Consumer {
    return this.kafka.consumer({ groupId: group });
  }
}
