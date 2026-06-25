import Event from '@blockchain/common/domain/events/event';

interface BlockchainInterface {
  length(): number;
  flushEvents(): Event[];
}

export default BlockchainInterface;
