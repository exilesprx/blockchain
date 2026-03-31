import { App, H3Event } from 'h3';
import { env } from 'std-env';
import Events from 'node:events';
import Blockchain from '@blockchain/common/domain/chain/blockchain';
import Link from '@blockchain/common/domain/chain/specifications/link';
import BlockMined from '@blockchain/common/domain/chain/specifications/mined';
import TransactionAdded from '@blockchain/common/domain/events/transaction-added';
import KafkaLogger from '@blockchain/common/infrastructure/logs/kafka-logger';
import Logger from '@blockchain/common/infrastructure/logs/logger';
import Amount from '@blockchain/common/domain/wallet/specifications/amount';
import Receiver from '@blockchain/common/domain/wallet/specifications/receiver';
import SameWallet from '@blockchain/common/domain/wallet/specifications/same-wallet';
import Sender from '@blockchain/common/domain/wallet/specifications/sender';
import TransactionPool from '@blockchain/common/domain/wallet/transaction-pool';
import Database from '@blockchain/common/infrastructure/database';
import BlockRepository from '@blockchain/common/infrastructure/repositories/block';
import BlockEventRepository from '@blockchain/common/infrastructure/repositories/block-event';
import TransactionEventRepository from '@blockchain/common/infrastructure/repositories/transaction-events';
import TransactionRepository from '@blockchain/common/infrastructure/repositories/transaction';
import BlockConsumer from '@blockchain/common/infrastructure/stream/block-consumer';
import Producer from '@blockchain/common/infrastructure/stream/producer';
import Stream from '@blockchain/common/infrastructure/stream/stream';
import AddBlockFromConsumer from '@blockchain/common/commands/add-block-from-consumer';
import AddTransactionFromRequest from '@blockchain/common/commands/add-transaction-from-request';
import Emitter from '@blockchain/common/events/emitter';
import TransactionRoute from '@/routes/transaction';
import Server, { ServerHooks } from '@/server/index';
import GelfTransport from '@blockchain/common/infrastructure/logs/transports/gelf';
import Console from '@blockchain/common/infrastructure/logs/transports/console';

export default class Application {
  private isDev: boolean;
  private server: Server;
  private emitter: Emitter;
  private chain: Blockchain;
  private pool: TransactionPool;
  private database: Database;
  private producer: Producer;
  private consumer: BlockConsumer;
  private logger: Logger;

  constructor() {
    this.isDev = env.NODE_ENV === 'development';
    this.logger = new Logger(this.logTransports());
    this.server = new Server(this.serverOptions());

    const stream = new Stream(new KafkaLogger(this.logger));
    this.database = new Database(
      String(env.DB_HOST),
      Number(env.DB_PORT),
      Boolean(env.DB_INSECURE)
    );
    this.producer = new Producer(stream);
    this.emitter = new Emitter(new Events(), this.producer, this.logger);
    this.chain = new Blockchain();
    this.pool = new TransactionPool();

    const repo = new BlockEventRepository(
      this.emitter,
      new BlockRepository(this.database)
    );
    const action = new AddBlockFromConsumer(this.chain, repo);
    this.consumer = new BlockConsumer(action, stream);
  }

  public init() {
    this.pool.addSpecification(
      new Amount(),
      new Receiver(),
      new Sender(),
      new SameWallet()
    );
    this.chain.addSpecification(new Link(), new BlockMined());
  }

  public registerEvents() {
    this.emitter.register(
      TransactionAdded.toString(),
      (event: TransactionAdded) => this.emitter.transactionAdded(event)
    );
  }

  public async boot(): Promise<App> {
    this.database.connect();
    await this.producer.connect();

    /**
     * TODO: restore from eventstore, we only need to worry about block heres,
     * the auditor will handle transactions
     */

    await this.consumer.connect();
    await this.consumer.run();
    return this.server.instance();
  }

  public registerRoutes() {
    const repository = new TransactionEventRepository(
      this.emitter,
      new TransactionRepository(this.database)
    );
    const action = new AddTransactionFromRequest(this.pool, repository);
    const transactionRoute = new TransactionRoute(action, this.logger);

    this.server.post(TransactionRoute.getName(), [transactionRoute.getAction]);
  }

  private serverOptions(): ServerHooks {
    let options: ServerHooks = {
      debug: this.isDev
    };

    if (this.isDev) {
      options.onError = (error: Error) => {
        this.logger.error(error.message);
      };
    }

    options.onRequest = (event: H3Event) => {
      this.logger.info('Request:' + event.path);
    };
    return options;
  }

  private logTransports(): (Console | GelfTransport)[] {
    if (this.isDev) {
      return [new Console()];
    }

    return [new GelfTransport()];
  }
}
