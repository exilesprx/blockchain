import BaseEmitter from '../../domain/events/emitter';
import { Block as BlockContract } from '../../infrastructure/database/models/block';
import { Transaction as TransactionContract } from '../../infrastructure/database/models/transaction';

export default class Emitter extends BaseEmitter {
  public blockAdded(block: BlockContract) : void {
    this.logger.info(`Block added: ${block.hash}`);
  }

  public transactionAdded(transaction: TransactionContract) : void {
    this.logger.info(`Transaction added: ${transaction.hash}`);

    this.producer.sendTransaction(transaction);
  }
}
