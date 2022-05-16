import Block from '../../domain/chain/block';
import BaseEmitter from '../../domain/events/emitter';
import Transaction from '../../domain/wallet/transaction';

export default class Emitter extends BaseEmitter {
  public blockAdded(block: Block) : void {
    this.logger.info(`Block added: ${block.getHash()}`);

    this.producer.sendBlock(block);
  }

  public transactionAdded(transaction: Transaction) : void {
    this.logger.info(`Transaction added: ${transaction.getHash()}`);
  }

  public blockMined(block: Block) {
    this.logger.info(`Block mined: ${block.getHash()}`);
  }

  public mineFailed(block: Block) : void {
    this.logger.error(`Block failed to be mined: ${block.getHash()}`);
    // TODO: Notify the auditor
  }
}
