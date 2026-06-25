import Blockchain from '@blockchain/common/domain/chain/blockchain';
import Emitter from '@blockchain/common/events/abstract-emitter';
import Event from '@blockchain/common/domain/events/event';
import BlockRepository from '@blockchain/common/infrastructure/repositories/block';

export default class BlockEventRepository {
  private emitter: Emitter;
  private repo: BlockRepository;

  public constructor(emitter: Emitter, repo: BlockRepository) {
    this.emitter = emitter;
    this.repo = repo;
  }

  public async persist(chain: Blockchain): Promise<void> {
    await this.repo.persist(chain);
    chain.flushEvents().forEach((event: Event) => {
      this.emitter.emit(event.toString(), event);
    });
  }
}
