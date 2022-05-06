import Database from '../../infrastructure/database';
import Transaction from '../../domain/wallet/transaction';
import TransactionPool from '../../domain/wallet/transaction-pool';
import TransactionDataTransferObject from '../data-transfer-objects/transaction';

export default class AddTransaction {
  private pool: TransactionPool;

  private database: Database;

  public constructor(pool: TransactionPool, database: Database) {
    this.pool = pool;

    this.database = database;
  }

  public execute(transactionData: TransactionDataTransferObject) : string {
    const { to, from, amount } = transactionData.destruct();

    const transaction = new Transaction(to, from, amount);

    this.pool.fill(transaction);

    this.database.persistTransaction(transaction);

    return transaction.getHash();
  }
}
