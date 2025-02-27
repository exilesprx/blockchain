import Events from 'events';
import Logger from '../../infrastructure/logs/logger';
import Producer from '../../infrastructure/stream/producer';
import Event from '../../domain/events/event';
import TransactionAdded from '../../domain/events/transaction-added';

export default abstract class Emitter {
  protected producer: Producer;
  protected logger: Logger;
  protected emitter: Events;

  constructor(emitter: Events, producer: Producer, logger: Logger) {
    this.emitter = emitter;
    this.producer = producer;
    this.logger = logger;
  }

  public register(event: string, callback: any): void {
    this.emitter.on(event, callback);
  }

  public emit(event: string, value: any): void {
    this.emitter.emit(event, value);
  }

  public abstract blockAdded(event: Event): void;
  public abstract blockMined(event: Event): void;
  public abstract mineFailed(event: Event): void;
  public abstract transactionAdded(event: TransactionAdded): void;
}
