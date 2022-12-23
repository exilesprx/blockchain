import Block from '../../domain/chain/block';
import Blockchain from '../../domain/chain/blockchain';
import BlockRepository from '../../infrastructure/repositories/block';

export default class AddBlock {
  private chain: Blockchain;

  private repo: BlockRepository;

  public constructor(chain: Blockchain, repo: BlockRepository) {
    this.chain = chain;

    this.repo = repo;
  }

  public execute(block: Block) : string {
    this.chain.addBlock(block);

    this.repo.persist(block);

    return block.getHash();
  }
}
