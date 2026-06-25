import Block from '@blockchain/common/domain/chain/block';

type Specification = {
  isSatisfiedBy(previous: Block, current: Block): void;
};

export default Specification;
