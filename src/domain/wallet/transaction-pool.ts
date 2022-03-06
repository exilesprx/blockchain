import Specification from "./specifications/specification";
import Transaction from "./transaction";

export default class TransactionPool
{
    private specifications: Specification[];

    constructor()
    {
        this.specifications = [];
    }

    public fill(transaction: Transaction) : void
    {
        this.specifications.forEach(spec => {
            spec.isSatisfiedBy(transaction);
        });
    }

    public addSpecification(specification: Specification) : this
    {
        this.specifications.push(specification);

        return this;
    }
}