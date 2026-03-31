import { jsonEvent } from '@eventstore/db-client';
import Blockchain from '@blockchain/common/domain/chain/blockchain';
import Database from '@blockchain/common/infrastructure/database/index';
import BlockEvent from '@blockchain/common/infrastructure/database/models/block';

export default class BlockRepository {
  private database: Database;

  public constructor(database: Database) {
    this.database = database;
  }

  public async persist(chain: Blockchain) {
    const data = chain.getPreviousBlock().toJson();
    const event = jsonEvent<BlockEvent>({
      type: 'block',
      data
    });
    await this.database.persist(event);
  }
}
