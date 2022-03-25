import Transaction from '../transaction';

interface Specification
{
    isSatisfiedBy(transaction: Transaction) : boolean;
}

export default Specification;
