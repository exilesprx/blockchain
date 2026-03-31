import Block from '@blockchain/common/domain/chain/block';
import Transaction from '@blockchain/common/domain/wallet/transaction';
import Event from '@blockchain/common/domain/events/event';
import { Block as BlockContract } from '@blockchain/common/infrastructure/database/models/block';

export default class BlockMined extends Event {
  private id: any;
  private transactions: Transaction[];
  private nounce: number;
  private difficulty: number;
  private previousHash: string;
  private hash: string;
  private date: number;

  public constructor(block: Block) {
    super();

    this.id = block.getKey();
    this.transactions = block.getTransactions();
    this.nounce = block.getNounce();
    this.difficulty = block.getDifficulty();
    this.previousHash = block.getPreviousHash();
    this.hash = block.getHash();
    this.date = block.getDate();
  }

  public toJson(): BlockContract {
    return {
      id: this.id,
      transactions: this.transactions.map((transaction: Transaction) =>
        transaction.toJson()
      ),
      nounce: this.nounce,
      difficulty: this.difficulty,
      previousHash: this.previousHash,
      hash: this.hash,
      date: this.date
    };
  }
}
