import Transaction from '../../domain/wallet/transaction';

export default class TransactionTranslator {
  public static fromRequest(params: { to: string, from: string, amount: number }) : Transaction {
    return new Transaction(
      params.to,
      params.from,
      params.amount,
    );
  }

  public static fromMessage(
    message: { id: any, to: string, from: string, amount: number, date: number, hash: string },
  ) : Transaction {
    return Transaction.fromMessage(
      message.id,
      message.to,
      message.from,
      message.amount,
      message.date,
      message.hash,
    );
  }
}
