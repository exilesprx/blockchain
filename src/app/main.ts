import Events from 'events';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import Block from '../domain/chain/block';
import Blockchain from '../domain/chain/blockchain';
import Link from '../domain/chain/specifications/link';
import BlockMined from '../domain/chain/specifications/mined';
import BlockAdded from '../domain/events/block-added';
import TransactionAdded from '../domain/events/transaction-added';
import KafkaLogger from '../domain/logs/kafka-logger';
import Logger from '../domain/logs/logger';
import Amount from '../domain/wallet/specifications/amount';
import Receiver from '../domain/wallet/specifications/receiver';
import SameWallet from '../domain/wallet/specifications/same-wallet';
import Sender from '../domain/wallet/specifications/sender';
import Transaction from '../domain/wallet/transaction';
import TransactionPool from '../domain/wallet/transaction-pool';
import Database from '../infrastructure/database';
import BlockRepository from '../infrastructure/repositories/block';
import BlockEventRepository from '../infrastructure/repositories/block-event';
import TransactionEventRepository from '../infrastructure/repositories/transaction-events';
import TransactionRepository from '../infrastructure/repositories/transaction';
import BlockConsumer from '../infrastructure/stream/block-consumer';
import Producer from '../infrastructure/stream/producer';
import Stream from '../infrastructure/stream/stream';
import AddBlock from './commands/add-block';
import AddTransaction from './commands/add-transaction';
import Emitter from './events/emitter';
import TransactionRoute from './routes/transaction';
import Server from './server';

export default class Application {
  private server: Server;

  private emitter: Emitter;

  private chain: Blockchain;

  private pool: TransactionPool;

  private database: Database;

  private producer: Producer;

  private consumer: BlockConsumer;

  private logger: Logger;

  constructor() {
    this.logger = new Logger();

    this.server = new Server(process.env.APP_PORT);

    const stream = new Stream(new KafkaLogger(this.logger));

    this.database = new Database(
      String(process.env.DB_HOST),
      Number(process.env.DB_PORT),
      Boolean(process.env.DB_INSECURE),
    );

    this.producer = new Producer(stream);

    this.emitter = new Emitter(new Events(), this.producer, this.logger);

    this.chain = new Blockchain();

    this.pool = new TransactionPool();

    const repo = new BlockEventRepository(this.emitter, new BlockRepository(this.database));
    const action = new AddBlock(this.chain, repo);

    this.consumer = new BlockConsumer(action, stream);
  }

  public init() {
    this.server.use(express.json(), helmet());

    this.pool.addSpecification(
      new Amount(),
      new Receiver(),
      new Sender(),
      new SameWallet(),
    );

    this.chain.addSpecification(
      new Link(),
      new BlockMined(),
    );
  }

  public registerEvents() {
    this.emitter.register(
      BlockAdded.toString(),
      (block: Block) => this.emitter.blockAdded(block),
    );

    this.emitter.register(
      TransactionAdded.toString(),
      (transaction: Transaction) => this.emitter.transactionAdded(transaction),
    );
  }

  public async boot() {
    this.database.connect();

    await this.producer.connect();

    /**
     * TODO: restore from eventstore, we only need to worry about block heres,
     * the auditor will handle transactions
     */

    await this.consumer.connect();

    await this.consumer.run();

    this.server.create(() => this.onConnect());
  }

  public registerRoutes() {
    const repository = new TransactionEventRepository(this.emitter, new TransactionRepository(this.database));
    const action = new AddTransaction(this.pool, repository);

    const transactionRoute = new TransactionRoute(action, this.logger);

    this.server.post(
      TransactionRoute.getName(),
      (req: Request, res: Response) => transactionRoute.getAction(req, res),
    );
  }

  private onConnect() : void {
    this.logger.info(`App listening on port ${this.server.getPort()}`);
  }
}
