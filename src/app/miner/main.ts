import Events from 'events';
import Blockchain from '../../domain/chain/blockchain';
import BlockAdded from '../../domain/events/block-added';
import MineFailed from '../../domain/events/mine-failed';
import KafkaLogger from '../../infrastructure/logs/kafka-logger';
import Logger from '../../infrastructure/logs/logger';
import TransactionPool from '../../domain/wallet/transaction-pool';
import Producer from '../../infrastructure/stream/producer';
import Stream from '../../infrastructure/stream/stream';
import BlockMined from '../../domain/events/block-mined';
import TransactionConsumer from '../../infrastructure/stream/transaction-consumer';
import AddTransactionFromConsumer from '../commands/add-transaction-from-consumer';
import Emitter from '../events/emitter';
import { Block as BlockContract } from '../../infrastructure/database/models/block';

export default class Miner {
  private emitter: Emitter;

  private consumer: TransactionConsumer;

  private producer: Producer;

  public constructor() {
    const logger = new Logger();

    const stream = new Stream(new KafkaLogger(logger));

    this.producer = new Producer(stream);

    this.emitter = new Emitter(new Events(), this.producer, logger);

    const chain = new Blockchain();

    const pool = new TransactionPool();

    const action = new AddTransactionFromConsumer(chain, pool);

    this.consumer = new TransactionConsumer(action, stream);
  }

  public registerEvents() : void {
    this.emitter.register(
      BlockAdded.toString(),
      (block: BlockContract) => this.emitter.blockAdded(block),
    );

    this.emitter.register(
      BlockMined.toString(),
      (block: BlockContract) => this.emitter.blockMined(block),
    );

    this.emitter.register(
      MineFailed.toString(),
      (block: BlockContract) => this.emitter.mineFailed(block),
    );
  }

  public async boot() : Promise<void> {
    await this.consumer.connect();

    await this.consumer.run();

    await this.producer.connect();
  }
}
