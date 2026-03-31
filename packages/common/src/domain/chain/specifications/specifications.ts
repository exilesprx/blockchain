import Block from '@blockchain/common/domain/chain/block';

type Specification = {
  isSatisfiedBy(prevous: Block, current: Block): void;
};

export default Specification;
