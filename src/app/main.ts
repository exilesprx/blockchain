/* eslint import/no-unresolved: 2 */
import EventEmitter from 'events';
import express, { Express } from 'express';
import Blockchain from '../domain/chain/blockchain';
import Events from '../domain/events/emitter';
import logger from '../domain/logs/logger';
import kafka from '../domain/stream/kafka';
import Producer from '../domain/stream/producer';
import BlockConsumer from '../domain/stream/block-consumer';
import Amount from '../domain/wallet/specifications/amount';
import Receiver from '../domain/wallet/specifications/receiver';
import SameWallet from '../domain/wallet/specifications/same-wallet';
import Sender from '../domain/wallet/specifications/sender';
import TransactionPool from '../domain/wallet/transaction-pool';
import TransactionRoute from './routes/transaction';
import Database from '../database';
import Bank from '../domain/bank';
import Link from '../domain/chain/specifications/link';

export default class Application {
  private app: Express;

  private emitter: EventEmitter;

  private events: Events;

  private chain: Blockchain;

  private pool: TransactionPool;

  private bank: Bank;

  private database: Database;

  private producer: Producer;

  private consumer: BlockConsumer;

  constructor() {
    this.app = express();

    this.database = new Database(String(process.env.DB_HOST), Number(process.env.DB_PORT));

    this.emitter = new EventEmitter();

    this.producer = new Producer(kafka);

    this.events = Events.register(this.emitter, this.producer, logger);

    this.chain = new Blockchain();

    this.pool = new TransactionPool();

    this.bank = new Bank(this.pool, this.chain, this.events);

    this.consumer = new BlockConsumer(this.bank, this.database, kafka);
  }

  public init() {
    this.app.use(express.json());

    this.pool.addSpecification(new Amount())
      .addSpecification(new Receiver())
      .addSpecification(new Sender())
      .addSpecification(new SameWallet());

    this.chain.addSpecification(new Link());
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
      logger.info(`App listening on port ${process.env.APP_PORT}`);
    });
  }

  public registerRoutes() {
    const transactionRoute = new TransactionRoute(this.database, this.bank);

    this.app.post(TransactionRoute.getName(), transactionRoute.getAction.bind(transactionRoute));
  }
}
