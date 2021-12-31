import Events from "../events/emitter";
import Specification from "./specifications/specification";
import Transaction from "./transaction";

export default class TransactionPool
{
    private events: Events;
    private specifications: Specification[];

    constructor(events: Events)
    {
        this.events = events;

        this.specifications = [];
    }

    public fill(to: string, from: string, amount: number) : Transaction
    {
        const transaction = new Transaction(to, from, amount);

        this.specifications.forEach(spec => {
            spec.isSatisfiedBy(transaction);
        });

        this.events.emit('transaction-added', transaction);

        return transaction;
    }

    public addSpecification(specification: Specification) : this
    {
        this.specifications.push(specification);

        return this;
    }
}