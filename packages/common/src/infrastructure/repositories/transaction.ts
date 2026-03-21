import { jsonEvent } from '@eventstore/db-client';
import TransactionPool from '../../domain/wallet/transaction-pool.js';
import Database from '../database/index.js';
import TransactionEvent from '../database/models/transaction.js';

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
