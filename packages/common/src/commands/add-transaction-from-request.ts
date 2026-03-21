import Transaction from '../domain/wallet/transaction.js';
import TransactionPool from '../domain/wallet/transaction-pool.js';
import TransactionEventRepository from '../infrastructure/repositories/transaction-events.js';

export default class AddTransactionFromRequest {
  private pool: TransactionPool;
  private repo: TransactionEventRepository;

  public constructor(pool: TransactionPool, repo: TransactionEventRepository) {
    this.pool = pool;
    this.repo = repo;
  }

  public execute(transaction: Transaction): string {
    this.pool.fill(transaction);
    this.repo.persist(this.pool);

    return transaction.getHash();
  }
}
