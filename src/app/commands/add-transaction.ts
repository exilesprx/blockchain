import Database from '../../infrastructure';
import Transaction from '../../domain/wallet/transaction';
import TransactionPool from '../../domain/wallet/transaction-pool';

export default class AddTransaction {
  private pool: TransactionPool;

  private database: Database;

  public constructor(pool: TransactionPool, database: Database) {
    this.pool = pool;

    this.database = database;
  }

  public execute(transaction: Transaction) {
    this.pool.fill(transaction);

    this.database.persistTransaction(transaction);
  }
}
