import BlockMesssage from '../../../app/data-transfer-objects/block';

export default class BlockTranslator {
  public static toBlock(value: Buffer) {
    const {
      id, nounce, difficulty, previousHash, transactions, date, hash,
    } = JSON.parse(value.toString());

    return new BlockMesssage(
      id,
      nounce,
      difficulty,
      previousHash,
      transactions,
      date,
      hash,
    );
  }
}
