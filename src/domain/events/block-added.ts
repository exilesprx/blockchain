import Block from '../chain/block';
import Transaction from '../wallet/transaction';
import Event from './event';

export default class BlockAdded extends Event {
  private id: any;

  private transactions: Transaction[];

  private nounce: number;

  private difficulty: number;

  private previousHash: string;

  private hash: string;

  public constructor(block: Block) {
    super('block-added');

    this.id = block.getKey();
    this.transactions = block.getTransactions();
    this.nounce = block.getNounce();
    this.difficulty = block.getDifficulty();
    this.previousHash = block.getPreviousHash();
    this.hash = block.getHash();
  }

  public toJson() {
    return {
      id: this.id,
      transactions: this.transactions,
      nounce: this.nounce,
      difficulty: this.difficulty,
      previousHash: this.previousHash,
      hash: this.hash,
    };
  }
}
