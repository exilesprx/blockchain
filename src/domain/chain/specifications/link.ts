import Block from '../block';
import Specification from './specifications';

export default class Link implements Specification {
  isSatisfiedBy(prevous: Block, current: Block): boolean {
    if (prevous.getHash() != current.getPreviousHash()) {
      throw new Error('Incorrect block reference.');
    }

    return true;
  }
}
