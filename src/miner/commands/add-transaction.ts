import Blockchain from '../../domain/chain/blockchain';
import Transaction from '../../domain/wallet/transaction';
import TransactionPool from '../../domain/wallet/transaction-pool';

export default class AddTransaction {
  private pool: TransactionPool;

  private chain: Blockchain;

  public constructor(chain: Blockchain, pool: TransactionPool) {
    this.chain = chain;

    this.pool = pool;
  }

  public execute(transaction: Transaction) : void {
    this.pool.fill(transaction);

    if (this.pool.shouldCreateNewBlock()) {
      const block = this.chain.createBlock(this.pool.flush());

      block.mine();

      this.chain.addBlock(block);
    }
  }
}
