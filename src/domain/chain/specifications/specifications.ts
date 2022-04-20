import Block from '../block';

interface Specification {
  isSatisfiedBy(prevous: Block, current: Block): void;
}

export default Specification;
