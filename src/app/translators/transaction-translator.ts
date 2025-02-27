import { v4 } from 'uuid';
import Transaction from '../../domain/wallet/transaction';
import { Transaction as TransactionContract } from '../../infrastructure/database/models/transaction';

export default class TransactionTranslator {
  public static fromRequest(
    to: string,
    from: string,
    amount: number
  ): Transaction {
    if (!to || !from || !amount) {
      throw new Error('Missing required properties: "to", "from", or "amount"');
    }

    return new Transaction(v4(), to, from, amount, Date.now());
  }

  public static fromObject(message: TransactionContract): Transaction {
    return new Transaction(
      message.id,
      message.to,
      message.from,
      message.amount,
      message.date
    );
  }

  public static fromObjectForMany(
    transactions: TransactionContract[]
  ): Transaction[] {
    const messageTransactions: Transaction[] = [];
    transactions.forEach((transaction: TransactionContract) => {
      messageTransactions.push(TransactionTranslator.fromObject(transaction));
    });

    return messageTransactions;
  }
}
