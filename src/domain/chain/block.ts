import { SHA256 } from 'crypto-js';
import BlockMinedPolicy from '../policies/block-mined-policy';
import Transaction from '../wallet/transaction';
import BlockState from './state/block-state';
import Mined from './state/mined';
import Unmined from './state/unmined';
import { Block as BlockContract } from '../../infrastructure/database/models/block';

export default class Block {
  private transactions: Transaction[];
  private id: any;
  private nounce: number;
  private difficulty: number;
  private previousHash: string;
  private hash: any;
  private date: number;
  private state: BlockState;

  constructor(
    id: any,
    nounce: number,
    difficulty: number,
    previousHash: string,
    transactions: Transaction[],
    date: number
  ) {
    this.id = id;
    this.nounce = nounce;
    this.difficulty = difficulty;
    this.previousHash = previousHash;
    this.transactions = transactions;
    this.date = date;
    this.hash = this.generateHash();
    this.state = this.determineState(this.hash);
  }

  public static genesis(): Block {
    return new this('genesis block', 0, 0, '0'.repeat(32), [], 0);
  }

  public async mine(): Promise<void> {
    while (
      !BlockMinedPolicy.containsSuccessiveChars(this.hash, this.difficulty)
    ) {
      this.nounce += 1;
      this.hash = this.generateHash();
    }
    this.state = new Mined();

    return Promise.resolve();
  }

  public getHash(): string {
    return this.hash;
  }

  public getPreviousHash(): string {
    return this.previousHash;
  }

  public getKey(): any {
    return this.id;
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getDate(): number {
    return this.date;
  }

  public getNounce(): number {
    return this.nounce;
  }

  public getDifficulty(): number {
    return this.difficulty;
  }

  public isMined(): boolean {
    return Mined.sameInstance(this.state);
  }

  private generateHash(): string {
    let transactionHashes = '';
    this.transactions.forEach((transaction) => {
      transactionHashes += transaction.getHash();
    });

    return SHA256(
      `${transactionHashes}${this.id}${this.nounce}${this.difficulty}${this.previousHash}${this.difficulty}${this.date}`
    ).toString();
  }

  protected determineState(hash: string): BlockState {
    if (BlockMinedPolicy.containsSuccessiveChars(hash, this.difficulty)) {
      return new Mined();
    }

    return new Unmined();
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
