import { Consumer as KafkaConsumer, EachMessagePayload } from 'kafkajs';
import Stream from './stream';
import { process } from 'std-env';

export default abstract class Consumer {
  protected consumer: KafkaConsumer;

  public constructor(stream: Stream) {
    this.consumer = stream.createConsumer(
      `${process.env.KAFKA_GROUP_ID}-${process.env.HOSTNAME}`
    );
  }

  public async connect(): Promise<void> {
    await this.consumer.connect();
  }

  public async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }

  protected async run(topic: string): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });
    await this.consumer.run({
      eachMessage: (payload: EachMessagePayload) =>
        this.transformMessage(payload)
    });
  }

  protected abstract transformMessage(
    payload: EachMessagePayload
  ): Promise<void>;
}
