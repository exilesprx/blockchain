import Transaction from '../transaction.js';

interface Specification {
  isSatisfiedBy(transaction: Transaction): void;
}

export default Specification;
