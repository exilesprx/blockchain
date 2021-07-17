import Blockchain from "../chain/blockchain";
import Events from "../events/emitter";
import NewBlockPolicy from "../policies/new-block-policy";
import Specification from "./specifications/Specification";
import Transaction from "./transaction";

export default class TransactionPool
{
    private transactions: Transaction[];
    private events: Events;
    private chain: Blockchain;
    private specifications: Specification[];

    constructor(events: Events, chain: Blockchain)
    {
        this.events = events;
        this.chain = chain;
        this.transactions = [];
        this.specifications = [];
    }

    public fill(to: string, from: string, amount: number) : Transaction
    {
        const transaction = new Transaction(to, from, amount);

        this.specifications.forEach(spec => {
            spec.isSatisfiedBy(transaction);
        });

        this.transactions.push(transaction);

        this.events.emit('transaction-added', transaction);

        if (this.chain.addBlock(this.getTransactions())) {
            this.drain();
        }

        return transaction;
    }

    public drain() : void
    {
        this.transactions = [];
    }

    public getTransactions() : Transaction[]
    {
        return this.transactions;
    }

    public length() : number
    {
        return this.transactions.length;
    }

    public addSpecification(specification: Specification) : this
    {
        this.specifications.push(specification);

        return this;
    }
}