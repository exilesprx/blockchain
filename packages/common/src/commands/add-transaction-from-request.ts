import Transaction from '@blockchain/common/domain/wallet/transaction';
import TransactionPool from '@blockchain/common/domain/wallet/transaction-pool';
import TransactionEventRepository from '@blockchain/common/infrastructure/repositories/transaction-events';

export default class AddTransactionFromRequest {
  private pool: TransactionPool;
  private repo: TransactionEventRepository;

  public constructor(pool: TransactionPool, repo: TransactionEventRepository) {
    this.pool = pool;
    this.repo = repo;
  }

  public async execute(transaction: Transaction): Promise<string> {
    this.pool.fill(transaction);
    await this.repo.persist(this.pool);

    return transaction.getHash();
  }
}
