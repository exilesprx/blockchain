import Transaction from '../../domain/wallet/transaction';

export default class BlockMesssage {
  public transactions: Transaction[];

  public id: any;

  public nounce: number;

  public difficulty: number;

  public previousHash: string;

  public date: number;

  public hash: string;

  constructor(
    id: any,
    nounce: number,
    difficulty: number,
    previousHash: string,
    transactions: Transaction[],
    date: number,
    hash: string,
  ) {
    this.id = id;
    this.nounce = nounce;
    this.difficulty = difficulty;
    this.previousHash = previousHash;
    this.transactions = transactions;
    this.date = date;
    this.hash = hash;
  }

  // TODO: need to convert transactions to objects
}
