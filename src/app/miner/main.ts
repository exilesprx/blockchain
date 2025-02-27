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

export default class Miner {
  private emitter: Emitter;
  private consumer: TransactionConsumer;
  private producer: Producer;

  public constructor() {
    const logger = new Logger([]);
    const chain = new Blockchain();
    const pool = new TransactionPool();
    const stream = new Stream(new KafkaLogger(logger));
    const action = new AddTransactionFromConsumer(chain, pool);
    this.producer = new Producer(stream);
    this.emitter = new Emitter(new Events(), this.producer, logger);
    this.consumer = new TransactionConsumer(action, stream);
  }

  public registerEvents(): void {
    this.emitter.register(BlockAdded.toString(), (event: BlockAdded) =>
      this.emitter.blockAdded(event)
    );
    this.emitter.register(BlockMined.toString(), (event: BlockMined) =>
      this.emitter.blockMined(event)
    );
    this.emitter.register(MineFailed.toString(), (event: MineFailed) =>
      this.emitter.mineFailed(event)
    );
  }

  public async boot(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.run();
    await this.producer.connect();
  }
}
