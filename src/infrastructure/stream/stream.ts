import { Consumer, Kafka, Producer } from 'kafkajs';
import KafkaLogger from '../logs/kafka-logger';
import { env } from 'std-env';

export default class Stream {
  private kafka: Kafka;

  public constructor(kafkaLogger: KafkaLogger) {
    this.kafka = new Kafka({
      clientId: env.KAFKA_CLIENT_ID,
      brokers: [`${env.KAFKA_HOST}:${env.KAFKA_PORT}`],
      logCreator: () => (info) => kafkaLogger.logCreator(info)
    });
  }

  public createProducer(): Producer {
    return this.kafka.producer();
  }

  public createConsumer(group: string): Consumer {
    return this.kafka.consumer({ groupId: group });
  }
}
