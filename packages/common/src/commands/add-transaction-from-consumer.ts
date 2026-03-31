import Blockchain from '@blockchain/common/domain/chain/blockchain';
import Transaction from '@blockchain/common/domain/wallet/transaction';
import TransactionPool from '@blockchain/common/domain/wallet/transaction-pool';

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
