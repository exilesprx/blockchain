import Events from 'events';
import express, { Express } from 'express';
import helmet from 'helmet';
import Database from '../database';
import Bank from '../domain/bank';
import Blockchain from '../domain/chain/blockchain';
import Link from '../domain/chain/specifications/link';
import Emitter from '../domain/events/emitter';
import KafkaLogger from '../domain/logs/kafka-logger';
import Logger from '../domain/logs/logger';
import BlockConsumer from '../domain/stream/block-consumer';
import Producer from '../domain/stream/producer';
import Stream from '../domain/stream/stream';
import Amount from '../domain/wallet/specifications/amount';
import Receiver from '../domain/wallet/specifications/receiver';
import SameWallet from '../domain/wallet/specifications/same-wallet';
import Sender from '../domain/wallet/specifications/sender';
import TransactionPool from '../domain/wallet/transaction-pool';
import TransactionRoute from './routes/transaction';

export default class Application {
  private app: Express;

  private events: Events;

  private emitter: Emitter;

  private chain: Blockchain;

  private pool: TransactionPool;

  private bank: Bank;

  private database: Database;

  private producer: Producer;

  private consumer: BlockConsumer;

  private logger: Logger;

  private stream: Stream;

  constructor() {
    this.app = express();

    this.logger = new Logger();

    this.stream = new Stream(new KafkaLogger(this.logger));

    this.database = new Database(String(process.env.DB_HOST), Number(process.env.DB_PORT));

    this.events = new Events();

    this.producer = new Producer(this.stream);

    this.emitter = new Emitter(this.events, this.producer, this.logger);

    this.chain = new Blockchain();

    this.pool = new TransactionPool();

    this.bank = new Bank(this.pool, this.chain, this.emitter);

    this.consumer = new BlockConsumer(this.bank, this.database, this.stream);
  }

  public init() {
    this.app.use(express.json());

    this.app.use(helmet());

    this.pool.addSpecification(new Amount())
      .addSpecification(new Receiver())
      .addSpecification(new Sender())
      .addSpecification(new SameWallet());

    this.chain.addSpecification(new Link());
  }

  public registerEvents() {
    this.emitter.register('block-added', this.emitter.blockAdded.bind(this.emitter));

    this.emitter.register('transaction-added', this.emitter.transactionAdded.bind(this.emitter));
  }

  public async boot() {
    this.database.connect();

    this.producer.connect();

    /**
     * TODO: restore from eventstore, we only need to worry about block heres,
     * the auditor will handle transactions
     */

    this.consumer.connect();

    this.app.listen(process.env.APP_PORT, () => {
      this.logger.info(`App listening on port ${process.env.APP_PORT}`);
    });
  }

  public registerRoutes() {
    const transactionRoute = new TransactionRoute(this.database, this.bank);

    this.app.post(TransactionRoute.getName(), transactionRoute.getAction.bind(transactionRoute));
  }
}
