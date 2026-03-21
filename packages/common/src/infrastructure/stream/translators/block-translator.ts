import TransactionTranslator from '../../../translators/transaction-translator.js';
import Block from '../../../domain/chain/block.js';
import Transaction from '../../../domain/wallet/transaction.js';
import { Block as BlockContract } from '../../database/models/block.js';
import { destr } from 'destr';

export default class BlockTranslator {
  public static fromMessage(value: Buffer): Block {
    const message: BlockContract = destr(value.toString());
    const transactions: Transaction[] = TransactionTranslator.fromObjectForMany(
      message.transactions
    );

    return new Block(
      message.id,
      message.nounce,
      message.difficulty,
      message.previousHash,
      transactions,
      message.date
    );
  }
}
