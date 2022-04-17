import Events from 'events';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import Database from '../database';
import Bank from '../domain/bank';
import Block from '../domain/chain/block';
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
import Transaction from '../domain/wallet/transaction';
import TransactionPool from '../domain/wallet/transaction-pool';
import TransactionRoute from './routes/transaction';
import Server from './server';

export default class Application {
  private server: Server;

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
    this.logger = new Logger();

    this.server = new Server(process.env.APP_PORT);

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
    this.server.use(express.json(), helmet());

    this.pool.addSpecification(
      new Amount(),
      new Receiver(),
      new Sender(),
      new SameWallet(),
    );

    this.chain.addSpecification(new Link());
  }

  public registerEvents() {
    this.emitter.register('block-added', (block: Block) => this.emitter.blockAdded(block));

    this.emitter.register('transaction-added', (transaction: Transaction) => this.emitter.transactionAdded(transaction));
  }

  public async boot() {
    this.database.connect();

    this.producer.connect();

    /**
     * TODO: restore from eventstore, we only need to worry about block heres,
     * the auditor will handle transactions
     */

    this.consumer.connect();

    this.server.create(() => this.onConnect());
  }

  public registerRoutes() {
    const transactionRoute = new TransactionRoute(this.database, this.bank, this.logger);

    this.server.post(
      TransactionRoute.getName(),
      (req: Request, res: Response) => transactionRoute.getAction(req, res),
    );
  }

  private onConnect() : void {
    this.logger.info(`App listening on port ${this.server.getPort()}`);
  }
}
