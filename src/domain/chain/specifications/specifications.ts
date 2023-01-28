import Block from '../block';

type Specification = {
  isSatisfiedBy(prevous: Block, current: Block): void;
}

export default Specification;
