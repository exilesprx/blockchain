import { JSONEventType } from '@eventstore/db-client';
import { Transaction as TransactionContract } from './transaction';

export type Block = {
  id: string,
  transactions: TransactionContract[],
  nounce: number,
  difficulty: number,
  previousHash: string,
  hash: string,
  date: number
};

type BlockEvent = JSONEventType<
'block',
Block
>;

export default BlockEvent;
