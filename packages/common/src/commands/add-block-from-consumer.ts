import Block from '@blockchain/common/domain/chain/block';
import Blockchain from '@blockchain/common/domain/chain/blockchain';
import BlockEventRepository from '@blockchain/common/infrastructure/repositories/block-event';

export default class AddBlockFromConsumer {
  private chain: Blockchain;
  private repo: BlockEventRepository;

  public constructor(chain: Blockchain, repo: BlockEventRepository) {
    this.chain = chain;
    this.repo = repo;
  }

  public execute(block: Block): string {
    this.chain.addBlock(block);
    this.repo.persist(this.chain);

    return block.getHash();
  }
}
