import Events from 'events';
import { Logger } from 'winston';
import Block from '../chain/block';
import Producer from '../stream/producer';
import Transaction from '../wallet/transaction';

export default class Emitter {
  private producer: Producer;

  private logger: Logger;

  private emitter: Events;

  constructor(emitter: Events, producer: Producer, logger: Logger) {
    this.emitter = emitter;

    this.producer = producer;

    this.logger = logger;
  }

  public register(event: string, callback: any) : void {
    this.emitter.on(event, callback);
  }

  public emit(event: string, value: any) : void {
    this.emitter.emit(event, value);
  }

  public blockAdded(block: Block) {
    this.logger.info(`Block added: ${block.getHash()}`);
  }

  public transactionAdded(transaction: Transaction) {
    this.logger.info(`Transaction added: ${transaction.getHash()}`);

    this.producer.send('transaction-added', transaction);
  }
}
