import Block from '../domain/chain/block.js';
import Blockchain from '../domain/chain/blockchain.js';
import BlockEventRepository from '../infrastructure/repositories/block-event.js';

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
