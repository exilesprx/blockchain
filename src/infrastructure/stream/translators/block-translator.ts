import TransactionTranslator from '../../../app/translators/transaction-translator';
import Block from '../../../domain/chain/block';
import Transaction from '../../../domain/wallet/transaction';

export default class BlockTranslator {
  public static fromMessage(value: Buffer) : Block {
    const {
      id, nounce, difficulty, previousHash, transactions, date, hash,
    } = JSON.parse(value.toString());

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
          TransactionTranslator.fromMessage(transaction),
        );
      },
    );

    return Block.fromMessage(
      id,
      nounce,
      difficulty,
      previousHash,
      messageTransactions,
      date,
      hash,
    );
  }
}
