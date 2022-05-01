import Block from '../../domain/chain/block';
import BaseEmitter from '../../domain/events/emitter';
import Transaction from '../../domain/wallet/transaction';

export default class Emitter extends BaseEmitter {
  public blockAdded(block: Block) : void {
    this.logger.info(`Block added: ${block.getHash()}`);
  }

  public transactionAdded(transaction: Transaction) : void {
    this.logger.info(`Transaction added: ${transaction.getHash()}`);

    this.producer.sendTransaction(transaction);
  }
}
