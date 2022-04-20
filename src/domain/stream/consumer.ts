import { Consumer as KafkaConsumer } from 'kafkajs';
import Database from '../../database';
import Bank from '../bank';
import Stream from './stream';

export default abstract class Consumer {
  protected consumer: KafkaConsumer;

  protected bank: Bank;

  protected database: Database;

  public constructor(bank: Bank, database: Database, stream: Stream) {
    this.bank = bank;

    this.database = database;

    this.consumer = stream.createConsumer(`${process.env.KAFKA_GROUP_ID}`);
  }

  public async connect() : Promise<void> {
    await this.consumer.connect();
  }

  public async disconnect() : Promise<void> {
    await this.consumer.disconnect();
  }

  public abstract run(topic: string) : Promise<void>;
}
