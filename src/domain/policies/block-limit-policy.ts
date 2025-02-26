import BlockchainInterface from '../chain/blockchain-interface';

export default class BlockLimitPolicy {
  private static limit = 10;

  public static reachedLimit(chain: BlockchainInterface): boolean {
    return chain.length() === this.limit;
  }

  public static getLimit(): number {
    return this.limit;
  }
}
