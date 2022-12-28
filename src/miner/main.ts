import Events from 'events';
import Block from '../domain/chain/block';
import Blockchain from '../domain/chain/blockchain';
import BlockAdded from '../domain/events/block-added';
import MineFailed from '../domain/events/mine-failed';
import KafkaLogger from '../domain/logs/kafka-logger';
import Logger from '../domain/logs/logger';
import Transaction from '../domain/wallet/transaction';
import TransactionPool from '../domain/wallet/transaction-pool';
import Producer from '../infrastructure/stream/producer';
import Stream from '../infrastructure/stream/stream';
import TransactionAdded from '../domain/events/transaction-added';
import BlockMined from '../domain/events/block-mined';
import TransactionConsumer from '../infrastructure/stream/transaction-consumer';
import AddTransaction from './commands/add-transaction';
import Emitter from './events/emitter';

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

    const pool = new TransactionPool(this.emitter);

    const action = new AddTransaction(chain, pool);

    this.consumer = new TransactionConsumer(action, stream);
  }

  public registerEvents() : void {
    this.emitter.register(
      BlockAdded.toString(),
      (block: Block) => this.emitter.blockAdded(block),
    );

    this.emitter.register(
      TransactionAdded.toString(),
      (transaction: Transaction) => this.emitter.transactionAdded(transaction),
    );

    this.emitter.register(
      BlockMined.toString(),
      (block: Block) => this.emitter.blockMined(block),
    );

    this.emitter.register(
      MineFailed.toString(),
      (block: Block) => this.emitter.mineFailed(block),
    );
  }

  public async boot() : Promise<void> {
    await this.consumer.connect();

    await this.consumer.run();

    await this.producer.connect();
  }
}
