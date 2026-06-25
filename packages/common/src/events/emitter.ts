import BaseEmitter from '@blockchain/common/events/abstract-emitter';
import Event from '@blockchain/common/domain/events/event';
import MineFailed from '@blockchain/common/domain/events/mine-failed';
import TransactionAdded from '@blockchain/common/domain/events/transaction-added';
import { Block as BlockContract } from '@blockchain/common/infrastructure/database/models/block';
import { Transaction as TransactionContract } from '@blockchain/common/infrastructure/database/models/transaction';

export default class Emitter extends BaseEmitter {
  public async transactionAdded(event: TransactionAdded): Promise<void> {
    const transaction = event.toJson() as TransactionContract;
    this.logger.info(`Transaction added: ${transaction.hash}`);
    await this.producer.sendTransaction(transaction);
  }

  public async blockAdded(event: Event): Promise<void> {
    const block = event.toJson() as BlockContract;
    this.logger.info(`Block added: ${block.hash}`);
    await this.producer.sendBlock(block);
  }

  public blockMined(event: Event) {
    const block = event.toJson() as BlockContract;
    this.logger.info(`Block mined: ${block.hash}`);
  }

  public mineFailed(event: MineFailed): void {
    let block = event.toJson();
    this.logger.error(
      `Block failed to be mined: ${block.id} - Error: ${event.error()}`
    );
    // TODO: Notify the auditor
  }
}
