import Events from 'events';
import Block from '../domain/chain/block';
import Blockchain from '../domain/chain/blockchain';
import KafkaLogger from '../domain/logs/kafka-logger';
import Logger from '../domain/logs/logger';
import Producer from '../domain/stream/producer';
import Stream from '../domain/stream/stream';
import TransactionConsumer from '../domain/stream/transaction-consumer';
import TransactionPool from '../domain/wallet/transaction-pool';
import AddTransaction from './commands/add-transaction';
import Emitter from './events/emitter';

export default class Miner {
  private emitter: Emitter;

  private consumer: TransactionConsumer;

  public constructor() {
    const logger = new Logger();

    const stream = new Stream(new KafkaLogger(logger));

    const producer = new Producer(stream);

    this.emitter = new Emitter(new Events(), producer, logger);

    const chain = new Blockchain(this.emitter);

    const pool = new TransactionPool(this.emitter);

    const action = new AddTransaction(chain, pool);

    this.consumer = new TransactionConsumer(action, stream);
  }

  public registerEvents() : void {
    this.emitter.register(
      'block-added',
      (block: Block) => this.emitter.blockAdded(block),
    );
  }

  public async boot() : Promise<void> {
    await this.consumer.connect();

    await this.consumer.run();
  }
}
