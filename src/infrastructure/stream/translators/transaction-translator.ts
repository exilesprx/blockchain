import Transaction from '../../../domain/wallet/transaction';
import { Transaction as TransactionContract } from '../../database/models/transaction';
import { destr } from 'destr';

export default class TransactionTranslator {
  public static fromMessage(value: Buffer): Transaction {
    const message: TransactionContract = destr(value.toString());

    return new Transaction(
      message.id,
      message.to,
      message.from,
      message.amount,
      message.date
    );
  }
}
