import { jsonEvent } from '@eventstore/db-client';
import TransactionPool from '@blockchain/common/domain/wallet/transaction-pool';
import Database from '@blockchain/common/infrastructure/database/index';
import TransactionEvent from '@blockchain/common/infrastructure/database/models/transaction';

export default class TransactionRepository {
  private database: Database;

  public constructor(database: Database) {
    this.database = database;
  }

  public async persist(pool: TransactionPool) {
    const data = pool.lastTransaction().toJson();
    const event = jsonEvent<TransactionEvent>({
      type: 'transaction',
      data
    });
    await this.database.persist(event);
  }
}
