import Database from '../../infrastructure/database';
import Block from '../../domain/chain/block';
import Blockchain from '../../domain/chain/blockchain';
import BlockDataTransferObject from '../data-transfer-objects/block';

export default class AddBlock {
  private chain: Blockchain;

  private database: Database;

  public constructor(chain: Blockchain, database: Database) {
    this.chain = chain;

    this.database = database;
  }

  public execute(blockData: BlockDataTransferObject) : string {
    const {
      id, nounce, difficulty, previousHash, transactions,
    } = blockData.destruct();

    const block = new Block(id, nounce, difficulty, previousHash, transactions);

    this.chain.addBlock(block);

    this.database.persistBlock(block);

    return block.getHash();
  }
}
