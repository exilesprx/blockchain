import { JSONEventType } from '@eventstore/db-client';
import Transaction from '../../domain/wallet/transaction';

export interface Block {
  id: string,
  transactions: Transaction[],
  nounce: number,
  difficulty: number,
  previousHash: string,
  hash: string,
  date: number
}

type BlockEvent = JSONEventType<
'block',
{
  id: string;
  transactions: Transaction[];
  nounce: number;
  difficulty: number;
  previousHash: string;
  hash: string;
  date: number;
}
>;

export default BlockEvent;
