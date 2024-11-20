import Events from "events";
import Logger from "../../infrastructure/logs/logger";
import Producer from "../../infrastructure/stream/producer";
import { Block as BlockContract } from "../../infrastructure/database/models/block";
import { Transaction as TransactionContract } from "../../infrastructure/database/models/transaction";

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

  public abstract blockAdded(block: BlockContract): void;

  public abstract transactionAdded(transaction: TransactionContract): void;
}
