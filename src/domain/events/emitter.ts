import Events from 'events';
import Logger from '../logs/logger';
import Block from '../chain/block';
import Producer from '../../infrastructure/stream/producer';
import Transaction from '../wallet/transaction';

export default abstract class Emitter {
  protected producer: Producer;

  protected logger: Logger;

  protected emitter: Events;

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

  public abstract blockAdded(block: Block) : void;

  public abstract transactionAdded(transaction: Transaction) : void;
}
