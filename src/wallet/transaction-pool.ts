import Specification from "./specifications/specification";
import Transaction from "./transaction";

export default class TransactionPool
{
    private specifications: Specification[];

    constructor()
    {
        this.specifications = [];
    }

    public fill(transaction: Transaction): Transaction
    {
        this.specifications.forEach(spec => {
            spec.isSatisfiedBy(transaction);
        });

        return transaction;
    }

    public addSpecification(specification: Specification) : this
    {
        this.specifications.push(specification);

        return this;
    }
}