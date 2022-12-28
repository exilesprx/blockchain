import { jsonEvent } from '@eventstore/db-client';
import Block from '../../domain/chain/block';
import Blockchain from '../../domain/chain/blockchain';
import Database from '../database';
import BlockEvent from '../database/models/block';

export default class BlockRepository {
  private database: Database;

  public constructor(database: Database) {
    this.database = database;
  }

  public async persist(chain: Blockchain) {
    // TODO: pass in chain
    // TODO: get last block
    // TODO: get data using to array on block
    // TODO: flush events and dispatch them
    const data = chain.getPreviousBlock().toJson();
    const event = jsonEvent<BlockEvent>({
      type: 'block',
      data,
    });

    await this.database.persist(event);
  }
}
