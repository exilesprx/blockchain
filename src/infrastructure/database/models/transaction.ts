import { JSONEventType } from '@eventstore/db-client';

export type Transaction = {
  id: string,
  to: string,
  from: string,
  amount: number,
  date: number,
  hash: string
};

type TransactionEvent = JSONEventType<
'transaction',
Transaction
>;

export default TransactionEvent;
