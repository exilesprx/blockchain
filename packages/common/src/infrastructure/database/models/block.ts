import { JSONEventType } from '@kurrent/kurrentdb-client';
import { Transaction as TransactionContract } from '@blockchain/common/infrastructure/database/models/transaction';

export type Block = {
  id: string;
  transactions: TransactionContract[];
  nounce: number;
  difficulty: number;
  previousHash: string;
  hash: string;
  date: number;
};

type BlockEvent = JSONEventType<'block', Block>;

export default BlockEvent;
