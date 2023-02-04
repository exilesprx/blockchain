import { v4 } from 'uuid';
import Transaction from '../../domain/wallet/transaction';
import { Transaction as TransactionContract } from '../../infrastructure/database/models/transaction';

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
    const message: TransactionContract = JSON.parse(value.toString());

    return new Transaction(
      message.id,
      message.to,
      message.from,
      message.amount,
      message.date,
    );
  }

  public static fromObject(message: TransactionContract) : Transaction {
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
      (transaction: TransactionContract) => {
        messageTransactions.push(
          TransactionTranslator.fromObject(transaction),
        );
      },
    );

    return messageTransactions;
  }
}
