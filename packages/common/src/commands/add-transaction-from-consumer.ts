import Blockchain from '../domain/chain/blockchain.js';
import Transaction from '../domain/wallet/transaction.js';
import TransactionPool from '../domain/wallet/transaction-pool.js';

export default class AddTransactionFromConsumer {
  private pool: TransactionPool;
  private chain: Blockchain;

  public constructor(chain: Blockchain, pool: TransactionPool) {
    this.chain = chain;
    this.pool = pool;
  }

  public execute(transaction: Transaction): void {
    this.pool.fill(transaction);

    if (this.pool.shouldCreateNewBlock()) {
      this.chain.mineBlock(this.pool.flush());
    }
  }
}
