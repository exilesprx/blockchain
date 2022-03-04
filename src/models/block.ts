import { Transaction } from './transaction';
import { JSONEventType } from '@eventstore/db-client';

export interface Block {
  id: string,
  transactions: Array<Transaction>,
  nounce: number,
  difficulty: number,
  previousHash: string,
  hash: string,
  date: number
}

type BlockEvent = JSONEventType<
  "blockchain",
  {
    id: string;
    transactions: Array<Transaction>;
    nounce: number;
    difficulty: number;
    previousHash: string;
    hash: string;
    date: number;
  }
>;

export default BlockEvent;