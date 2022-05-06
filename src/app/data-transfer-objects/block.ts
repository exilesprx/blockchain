import Transaction from '../../domain/wallet/transaction';

export default class BlockDataTransferObject {
  private transactions: Transaction[];

  private id: any;

  private nounce: number;

  private difficulty: number;

  private previousHash: string;

  constructor(
    id: any,
    nounce: number,
    difficulty: number,
    previousHash: string,
    transactions: Transaction[],
  ) {
    this.id = id;
    this.nounce = nounce;
    this.difficulty = difficulty;
    this.previousHash = previousHash;
    this.transactions = transactions;
  }

  public destruct(): {
    id: any; nounce: number; difficulty: number; previousHash: string; transactions: Transaction[];
  } {
    return {
      id: this.id,
      nounce: this.nounce,
      difficulty: this.difficulty,
      previousHash: this.previousHash,
      transactions: this.transactions,
    };
  }
}
