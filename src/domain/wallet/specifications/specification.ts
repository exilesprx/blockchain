import Transaction from "../transaction";

export default interface Specification
{
    isSatisfiedBy(transaction: Transaction) : boolean;
}