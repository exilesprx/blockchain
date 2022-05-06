import Transaction from '../transaction';

interface Specification {
  isSatisfiedBy(transaction: Transaction) : void;
}

export default Specification;
