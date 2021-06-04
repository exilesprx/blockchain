import { Producer } from "kafkajs";
import Transaction from "./transaction";

export default class TransactionPool
{
    private transactions: Transaction[];
    private limit: number;
    private producer: Producer;

    constructor(producer: Producer)
    {
        this.producer = producer;
        this.transactions = [];
        this.limit = 20;
    }

    public addTransaction(to: string, from: string, amount: number) : Transaction
    {
        const transaction = new Transaction(to, from, amount);

        this.transactions.push(transaction);

        this.producer.send({
            topic: 'transaction-test',
            messages: [
                { key: transaction.getKey(), value: JSON.stringify(transaction) },
            ],
        });

        return transaction;
    }

    public getTransactions() : Transaction[]
    {
        let transactions = this.transactions;

        this.transactions = [];

        return transactions;
    }

    public isFilled() : boolean
    {
        return this.transactions.length == this.limit;
    }
}