import TransactionTranslator from "../../../app/translators/transaction-translator";
import Block from "../../../domain/chain/block";
import Transaction from "../../../domain/wallet/transaction";
import { Block as BlockContract } from "../../database/models/block";

export default class BlockTranslator {
  public static fromMessage(value: Buffer): Block {
    const message: BlockContract = JSON.parse(value.toString());

    const transactions: Transaction[] = TransactionTranslator.fromObjectForMany(
      message.transactions,
    );

    return new Block(
      message.id,
      message.nounce,
      message.difficulty,
      message.previousHash,
      transactions,
      message.date,
    );
  }
}
