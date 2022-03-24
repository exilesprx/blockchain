import Block from './block';
import BlockLimitPolicy from '../policies/block-limit-policy';
import Specification from './specifications/specifications';

export default class Blockchain {
  private chain: Block[];

  private specifications: Specification[];

  constructor() {
    this.chain = [Block.genesis()];

    this.specifications = [];
  }

  public addBlock(block: Block) : void {
    this.specifications.forEach((spec) => {
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

  public addSpecification(spec: Specification) {
    this.specifications.push(spec);
  }

  private getPreviousBlock() : Block {
    return this.chain[this.chain.length - 1];
  }

  private removeFirstBlock() : Block|undefined {
    return this.chain.shift();
  }
}
