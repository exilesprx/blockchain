import BaseEmitter from "./abstract-emitter";
import Event from "../../domain/events/event";
import MineFailed from "../../domain/events/mine-failed";
import TransactionAdded from "../../domain/events/transaction-added";

export default class Emitter extends BaseEmitter {
  public transactionAdded(event: TransactionAdded): void {
    let transaction = event.toJson();
    this.logger.info(`Transaction added: ${transaction.hash}`);

    this.producer.sendTransaction(transaction);
  }

  public blockAdded(event: Event): void {
    let block = event.toJson();
    this.logger.info(`Block added: ${block.hash}`);

    this.producer.sendBlock(block);
  }

  public blockMined(event: Event) {
    let block = event.toJson();
    this.logger.info(`Block mined: ${block.hash}`);
  }

  public mineFailed(event: MineFailed): void {
    let block = event.toJson();
    this.logger.error(`Block failed to be mined: ${block.id} - Error: ${event.error()}`);
    // TODO: Notify the auditor
  }
}
