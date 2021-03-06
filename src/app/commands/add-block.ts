import Database from '../../infrastructure/database';
import Block from '../../domain/chain/block';
import Blockchain from '../../domain/chain/blockchain';

export default class AddBlock {
  private chain: Blockchain;

  private database: Database;

  public constructor(chain: Blockchain, database: Database) {
    this.chain = chain;

    this.database = database;
  }

  public execute(block: Block) : string {
    this.chain.addBlock(block);

    this.database.persistBlock(block);

    return block.getHash();
  }
}
