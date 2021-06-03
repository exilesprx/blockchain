import Transaction from "./transaction";

export default class TransactionPool
{
    private transactions: Transaction[];
    private limit: number;

    constructor()
    {
        this.transactions = [];
        this.limit = 20;
    }

    addTransaction(transaction: Transaction) : void
    {
        this.transactions.push(transaction);
    }

    getTransactions() : Transaction[]
    {
        let transactions = this.transactions;

        this.transactions = [];

        return transactions;
    }

    isFilled() : boolean
    {
        return this.transactions.length == this.limit;
    }
}