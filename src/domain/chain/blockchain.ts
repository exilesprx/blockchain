import { v4 } from 'uuid';
import BlockAdded from '../events/block-added';
import MineFailed from '../events/mine-failed';
import BlockMined from '../events/block-mined';
import BlockLimitPolicy from '../policies/block-limit-policy';
import Transaction from '../wallet/transaction';
import Block from './block';
import BlockchainInterface from './blockchain-interface';
import Specification from './specifications/specifications';

export default class Blockchain implements BlockchainInterface {
  private events: any[];

  private chain: Block[];

  private specifications: Specification[];

  private static startingNounce: number = 0;

  constructor() {
    this.events = [];

    this.chain = [Block.genesis()];

    this.specifications = [];
  }

  public flush(): any[] {
    return this.events.splice(0, this.events.length);
  }

  public async mineBlock(transactions: Transaction[]) : Promise<void> {
    const difficulty = 1;

    const block = new Block(
      v4(),
      Blockchain.startingNounce,
      difficulty,
      this.getPreviousHash(),
      transactions,
      Date.now(),
    );

    try {
      await block.mine();

      this.addBlock(block);
      this.events.push(new BlockMined(block));
      //this.emitter.emit(new BlockMined().toString(), block);
    } catch (error: any) {
      this.events.push(new MineFailed());
      //this.emitter.emit(new MineFailed().toString(), block);
    }
  }

  public addBlock(block: Block) : void {
    this.specifications.forEach((spec: Specification) => {
      spec.isSatisfiedBy(this.getPreviousBlock(), block);
    });

    if (BlockLimitPolicy.reachedLimit(this)) {
      this.removeFirstBlock();
    }

    this.chain.push(block);

    // TODO: update to push to array - events
    this.events.push(new BlockAdded(block));
    //this.emitter.emit(new BlockAdded().toString(), block);
  }

  public length() : number {
    return this.chain.length;
  }

  public addSpecification(...specification: Specification[]) : void {
    this.specifications.push(...specification);
  }

  public getPreviousBlock() : Block {
    return this.chain[this.chain.length - 1];
  }

  private removeFirstBlock() : Block | undefined {
    return this.chain.shift();
  }

  private getPreviousHash() : string {
    return this.getPreviousBlock().getHash();
  }
}
