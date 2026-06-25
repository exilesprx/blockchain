import CryptoJS from 'crypto-js';
import BlockMinedPolicy from '@blockchain/common/domain/policies/block-mined-policy';
import Transaction from '@blockchain/common/domain/wallet/transaction';
import BlockState from '@blockchain/common/domain/chain/state/block-state';
import Mined from '@blockchain/common/domain/chain/state/mined';
import Unmined from '@blockchain/common/domain/chain/state/unmined';
import { Block as BlockContract } from '@blockchain/common/infrastructure/database/models/block';

export default class Block {
  private id: string;
  private hash: string;
  private transactions: Transaction[];
  private nounce: number;
  private difficulty: number;
  private previousHash: string;
  private date: number;
  private state: BlockState;

  constructor(
    id: string,
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
    let iterations = 0;

    while (
      !BlockMinedPolicy.containsSuccessiveChars(this.hash, this.difficulty)
    ) {
      this.nounce += 1;
      this.hash = this.generateHash();
      iterations += 1;

      if (iterations % 1000 === 0) {
        await new Promise<void>((resolve) => setImmediate(resolve));
      }
    }
    this.state = new Mined();
  }

  public getHash(): string {
    return this.hash;
  }

  public getPreviousHash(): string {
    return this.previousHash;
  }

  public getKey(): string {
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
    return this.state.sameInstance(new Mined());
  }

  private generateHash(): string {
    let transactionHashes = '';
    this.transactions.forEach((transaction) => {
      transactionHashes += transaction.getHash();
    });

    return CryptoJS.SHA256(
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
