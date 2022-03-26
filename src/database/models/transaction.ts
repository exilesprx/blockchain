import { JSONEventType } from '@eventstore/db-client';

export interface Transaction {
  id: string,
  to: string,
  from: string,
  amount: number,
  date: number,
  hash: string
}

type TransactionEvent = JSONEventType<
'transaction',
{
  id: string;
  to: string;
  from: string;
  amount: number;
  date: number;
  hash: string;
}
>;

export default TransactionEvent;
