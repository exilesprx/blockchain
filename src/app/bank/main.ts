import { App, H3Event } from "h3";
import { process } from "std-env";
import Events from "events";
import Blockchain from "../../domain/chain/blockchain";
import Link from "../../domain/chain/specifications/link";
import BlockMined from "../../domain/chain/specifications/mined";
import TransactionAdded from "../../domain/events/transaction-added";
import KafkaLogger from "../../infrastructure/logs/kafka-logger";
import Logger from "../../infrastructure/logs/logger";
import Amount from "../../domain/wallet/specifications/amount";
import Receiver from "../../domain/wallet/specifications/receiver";
import SameWallet from "../../domain/wallet/specifications/same-wallet";
import Sender from "../../domain/wallet/specifications/sender";
import TransactionPool from "../../domain/wallet/transaction-pool";
import Database from "../../infrastructure/database";
import BlockRepository from "../../infrastructure/repositories/block";
import BlockEventRepository from "../../infrastructure/repositories/block-event";
import TransactionEventRepository from "../../infrastructure/repositories/transaction-events";
import TransactionRepository from "../../infrastructure/repositories/transaction";
import BlockConsumer from "../../infrastructure/stream/block-consumer";
import Producer from "../../infrastructure/stream/producer";
import Stream from "../../infrastructure/stream/stream";
import AddBlockFromConsumer from "../commands/add-block-from-consumer";
import AddTransactionFromRequest from "../commands/add-transaction-from-request";
import Emitter from "../events/emitter";
import TransactionRoute from "../routes/transaction";
import Server, { ServerHooks } from "../server";
import GelfTransport from "../../infrastructure/logs/transports/gelf";
import Console from "../../infrastructure/logs/transports/console";

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
    this.isDev = process.env.NODE_ENV === "development";
    this.logger = new Logger(this.logTransports());
    this.server = new Server(this.serverOptions());

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

    const repo = new BlockEventRepository(
      this.emitter,
      new BlockRepository(this.database),
    );
    const action = new AddBlockFromConsumer(this.chain, repo);
    this.consumer = new BlockConsumer(action, stream);
  }

  public init() {
    this.pool.addSpecification(
      new Amount(),
      new Receiver(),
      new Sender(),
      new SameWallet(),
    );
    this.chain.addSpecification(new Link(), new BlockMined());
  }

  public registerEvents() {
    this.emitter.register(
      TransactionAdded.toString(),
      (event: TransactionAdded) => this.emitter.transactionAdded(event),
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
      new TransactionRepository(this.database),
    );
    const action = new AddTransactionFromRequest(this.pool, repository);
    const transactionRoute = new TransactionRoute(action, this.logger);

    this.server.post(TransactionRoute.getName(), [transactionRoute.getAction]);
  }

  private serverOptions(): ServerHooks {
    let options: ServerHooks = {
      debug: this.isDev,
    };

    if (this.isDev) {
      options.onError = (error: Error) => {
        this.logger.error(error.message);
      };
    }

    options.onRequest = (event: H3Event) => {
      this.logger.error("Request:" + event.path);
    };
    return options;
  }

  private logTransports(): any[] {
    if (this.isDev) {
      return [new Console()];
    }

    return [new GelfTransport()];
  }
}
