import { v4 } from 'uuid';
import Transaction from '../../domain/wallet/transaction';

export default class TransactionTranslator {
  public static fromRequest(params: { to: string, from: string, amount: number }) : Transaction {
    return new Transaction(
      v4(),
      params.to,
      params.from,
      params.amount,
      Date.now(),
    );
  }

  public static fromMessage(value: Buffer) : Transaction {
    const message: {
      id: any,
      to: string,
      from: string,
      amount: number,
      date: number,
      hash: string
    } = JSON.parse(value.toString());

    return new Transaction(
      message.id,
      message.to,
      message.from,
      message.amount,
      message.date,
    );
  }

  public static fromObject(
    message: { id: any, to: string, from: string, amount: number, date: number },
  ) : Transaction {
    return new Transaction(
      message.id,
      message.to,
      message.from,
      message.amount,
      message.date,
    );
  }

  public static fromObjectForMany(transactions: []) : Transaction[] {
    const messageTransactions: Transaction[] = [];

    transactions.forEach(
      (
        transaction: {
          id: any,
          to: string,
          from: string,
          amount: number,
          date: number,
          hash: string
        },
      ) => {
        messageTransactions.push(
          TransactionTranslator.fromObject(transaction),
        );
      },
    );

    return messageTransactions;
  }
}
