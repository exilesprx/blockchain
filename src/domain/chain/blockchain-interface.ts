interface BlockchainInterface {
  length() : number;

  flushEvents() : any[];
}

export default BlockchainInterface;
