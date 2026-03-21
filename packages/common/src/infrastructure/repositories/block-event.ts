import Blockchain from '../../domain/chain/blockchain.js';
import Emitter from '../../events/abstract-emitter.js';
import Event from '../../domain/events/event.js';
import BlockRepository from './block.js';

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
