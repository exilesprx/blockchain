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
  ) {
    this.id = id;
    this.nounce = nounce;
    this.difficulty = difficulty;
    this.previousHash = previousHash;
    this.transactions = transactions;
    this.date = Date.now();
    this.hash = this.generateHash();
  }

  public static fromMessage(
    id: any,
    nounce: number,
    difficulty: number,
    previousHash: string,
    transactions: Transaction[],
    date: number,
    hash: string,
  ) : Block {
    const block = new this(id, nounce, difficulty, previousHash, transactions);

    block.date = date;
    block.hash = hash; // TODO: regenerate hash

    return block;
  }

  public static genesis() : Block {
    // TODO: pass 0 as date
    return new this('genesis block', 0, 0, '0'.repeat(32), []);
  }

  public mine() : Promise<void> {
    while (!BlockMinedPolicy.mined(this.hash, this.difficulty)) {
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

  private generateHash() : string {
    let transactionHashes = '';

    this.transactions.forEach((transaction) => {
      transactionHashes += transaction.getHash();
    });

    return SHA256(`${transactionHashes}${this.id}${this.nounce}${this.difficulty}${this.previousHash}${this.difficulty}${this.date}`).toString();
  }
}
