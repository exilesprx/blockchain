import Block from './block';
import BlockLimitPolicy from '../policies/block-limit-policy';
import Specification from './specifications/specifications';
import BlockchainInterface from './blockchain-interface';

export default class Blockchain implements BlockchainInterface {
  private chain: Block[];

  private specifications: Specification[];

  constructor() {
    this.chain = [Block.genesis()];

    this.specifications = [];
  }

  public addBlock(block: Block) : void {
    this.specifications.forEach((spec: Specification) => {
      spec.isSatisfiedBy(this.getPreviousBlock(), block);
    });

    if (BlockLimitPolicy.reachedLimit(this)) {
      this.removeFirstBlock();
    }

    this.chain.push(block);
  }

  public length() : number {
    return this.chain.length;
  }

  public addSpecification(...specification: Specification[]) : void {
    this.specifications.push(...specification);
  }

  private getPreviousBlock() : Block {
    return this.chain[this.chain.length - 1];
  }

  private removeFirstBlock() : Block | undefined {
    return this.chain.shift();
  }
}
