import Block from '../block.js';

type Specification = {
  isSatisfiedBy(prevous: Block, current: Block): void;
};

export default Specification;
