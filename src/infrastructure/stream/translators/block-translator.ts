import TransactionTranslator from '../../../app/translators/transaction-translator';
import Block from '../../../domain/chain/block';
import Transaction from '../../../domain/wallet/transaction';

export default class BlockTranslator {
  public static fromMessage(value: Buffer) : Block {
    const {
      id, nounce, difficulty, previousHash, transactions, date,
    } = JSON.parse(value.toString());

    const mTransactions: Transaction[] = TransactionTranslator.fromObjectForMany(transactions);

    return new Block(
      id,
      nounce,
      difficulty,
      previousHash,
      mTransactions,
      date,
    );
  }
}
