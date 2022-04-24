import { SHA256 } from 'crypto-js';
import Transaction from '../wallet/transaction';

export default class Block {
  private transactions: Transaction[];

  private id: any;

  private nounce: number;

  private difficulty: number;

  private previousHash: string;

  private hash: any;

  private date: number;

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
    this.date = Date.now();
    this.hash = this.generateHash();
  }

  public static genesis() : Block {
    return new this('genesis block', 0, 0, '00', []);
  }

  public mine() : void {
    const hash = this.generateHash();

    const chars = hash.slice(0, this.difficulty);

    while (chars !== '0'.repeat(this.difficulty)) {
      this.nounce += 1;

      this.hash = this.generateHash();
    }
  }

  public getHash() : string {
    return this.hash;
  }

  public getPreviousHash() : string {
    return this.previousHash;
  }

  public getKey() : any {
    return this.id;
  }

  public getTransactions() : Transaction[] {
    return this.transactions;
  }

  public getDate() : number {
    return this.date;
  }

  private generateHash() : string {
    let transactionHashes = '';

    this.transactions.forEach((transaction) => {
      transactionHashes += transaction.getHash();
    });

    return SHA256(`${transactionHashes}${this.id}${this.nounce}${this.difficulty}${this.previousHash}${this.difficulty}${this.date}`).toString();
  }
}
