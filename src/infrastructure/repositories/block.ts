import { jsonEvent } from "@eventstore/db-client";
import Blockchain from "../../domain/chain/blockchain";
import Database from "../database";
import BlockEvent from "../database/models/block";

export default class BlockRepository {
  private database: Database;

  public constructor(database: Database) {
    this.database = database;
  }

  public async persist(chain: Blockchain) {
    const data = chain.getPreviousBlock().toJson();
    const event = jsonEvent<BlockEvent>({
      type: "block",
      data,
    });
    await this.database.persist(event);
  }
}
