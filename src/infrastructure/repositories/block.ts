import { jsonEvent } from '@eventstore/db-client';
import Block from '../../domain/chain/block';
import Database from '../database';
import BlockEvent from '../database/models/block';

export default class BlockRepository {
  private database: Database;

  public constructor(database: Database) {
    this.database = database;
  }

  public async persist(block: Block) {
    const event = jsonEvent<BlockEvent>({
      type: 'block',
      data: {
        id: block.getKey(),
        transactions: block.getTransactions(),
        nounce: block.getNounce(),
        difficulty: block.getDifficulty(),
        previousHash: block.getPreviousHash(),
        hash: block.getHash(),
        date: block.getDate(),
      },
    });

    await this.database.persist(event);
  }
}
