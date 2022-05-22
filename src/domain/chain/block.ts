import { SHA256 } from 'crypto-js';
import BlockMinedPolicy from '../policies/block-mined-policy';
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
    date: number,
  ) {
    this.id = id;
    this.nounce = nounce;
    this.difficulty = difficulty;
    this.previousHash = previousHash;
    this.transactions = transactions;
    this.date = date;
    this.hash = this.generateHash();
  }

  public static genesis() : Block {
    return new this('genesis block', 0, 0, '0'.repeat(32), [], 0);
  }

  public async mine() : Promise<void> {
    while (!this.isMined()) {
      this.nounce += 1;

      this.hash = this.generateHash();
    }

    return Promise.resolve();
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

  public getNounce() : number {
    return this.nounce;
  }

  public getDifficulty() : number {
    return this.difficulty;
  }

  public isMined() : boolean {
    return BlockMinedPolicy.containsSuccessiveChars(this.hash, this.difficulty);
  }

  private generateHash() : string {
    let transactionHashes = '';

    this.transactions.forEach((transaction) => {
      transactionHashes += transaction.getHash();
    });

    return SHA256(`${transactionHashes}${this.id}${this.nounce}${this.difficulty}${this.previousHash}${this.difficulty}${this.date}`).toString();
  }
}
