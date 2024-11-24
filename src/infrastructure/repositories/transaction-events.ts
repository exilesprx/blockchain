import Emitter from "../../app/events/abstract-emitter";
import Event from "../../domain/events/event";
import TransactionPool from "../../domain/wallet/transaction-pool";
import TransactionRepository from "./transaction";

export default class TransactionEventRepository {
  private emitter: Emitter;
  private repo: TransactionRepository;

  public constructor(emitter: Emitter, repo: TransactionRepository) {
    this.emitter = emitter;
    this.repo = repo;
  }

  public persist(pool: TransactionPool): void {
    this.repo.persist(pool);
    pool.flushEvents().forEach((event: Event) => {
      this.emitter.emit(event.toString(), event.toJson());
    });
  }
}
