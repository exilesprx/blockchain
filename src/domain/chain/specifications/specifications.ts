import Block from '../block';

interface Specification {
  isSatisfiedBy(prevous: Block, current: Block): boolean;
}

export default Specification;
