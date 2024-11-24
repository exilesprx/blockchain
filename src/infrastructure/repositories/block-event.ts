import Blockchain from "../../domain/chain/blockchain";
import Emitter from "../../app/events/abstract-emitter";
import Event from "../../domain/events/event";
import BlockRepository from "./block";

export default class BlockEventRepository {
  private emitter: Emitter;
  private repo: BlockRepository;

  public constructor(emitter: Emitter, repo: BlockRepository) {
    this.emitter = emitter;
    this.repo = repo;
  }

  public persist(chain: Blockchain): void {
    this.repo.persist(chain);
    chain.flushEvents().forEach((event: Event) => {
      this.emitter.emit(event.toString(), event);
    });
  }
}
