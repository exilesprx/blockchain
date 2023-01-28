import BaseEmitter from '../../domain/events/emitter';
import { Block as BlockContract } from '../../infrastructure/database/models/block';
import { Transaction as TransactionContract } from '../../infrastructure/database/models/transaction';

export default class Emitter extends BaseEmitter {
  public blockAdded(block: BlockContract) : void {
    this.logger.info(`Block added: ${block.hash}`);

    this.producer.sendBlock(block);
  }

  public transactionAdded(transaction: TransactionContract) : void {
    this.logger.info(`Transaction added: ${transaction.hash}`);
  }

  public blockMined(block: BlockContract) {
    this.logger.info(`Block mined: ${block.hash}`);
  }

  public mineFailed(block: BlockContract) : void {
    this.logger.error(`Block failed to be mined: ${block.hash}`);
    // TODO: Notify the auditor
  }
}
