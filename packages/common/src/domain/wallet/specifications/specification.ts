import Transaction from '@blockchain/common/domain/wallet/transaction';

interface Specification {
  isSatisfiedBy(transaction: Transaction): void;
}

export default Specification;
