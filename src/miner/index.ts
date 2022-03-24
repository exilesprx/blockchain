export default class Miner {
  public mine() : void {
    if (NewBlockPolicy.shouldCreateNewBlock(this.transactions)) {
      this.chain.createBlock(this.transactions);
      this.drain();
    }
  }

  public createBlock(transactions: Transaction[]) : Block {
    if (BlockLimitPolicy.reachedLimit(this)) {
      this.removeFirstBlock();
    }

    const block = new Block(v4(), 0, 0, this.getLastBlockHash(), transactions);

    return block;
  }

  // TODO: consume transactions
  // TODO: add to block
  // TODO: mine block
}
