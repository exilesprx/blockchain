import { SHA256 } from "crypto-js";
import Transaction from "../wallet/transaction";
import { Block as BlockContract } from "../models/block";

export default class Block
{
    private transactions: Transaction[];
    private id: any;
    private nounce: number;
    private difficulty: number;
    private previousHash: string;
    private hash: any;
    private date: number;


    constructor(id: any, nounce: number, difficulty: number, previousHash: string, transactions: Transaction[])
    {
        this.id = id;
        this.nounce = nounce;
        this.difficulty = difficulty;
        this.previousHash = previousHash;
        this.transactions = transactions;
        this.date = Date.now();
        this.hash = this.generateHash();
    }

    public static genesis() : Block
    {
        return new this("genesis block", 0, 0, "00", []);
    }

    public static fromModel(model: BlockContract) : Block
    {
        let transactions: Transaction[] = [];

        model.transactions.forEach(transaction => {
            
            transactions.push(
                Transaction.fromModel(transaction)
            );
        });

        const block = new this(
            model.id,
            model.nounce,
            model.difficulty,
            model.previousHash,
            transactions
        );

        block.hash = model.hash;
        block.date = model.date;

        return block;
    }

    public getHash() : string
    {
        return this.hash;
    }

    public getKey() : any
    {
        return this.id;
    }

    public getTransactionCount() : number
    {
        return this.transactions.length;
    }

<<<<<<< HEAD
    public getDate() : Date
    {
        return new Date(this.date);
=======
    public getLastTransactionDate() : Date
    {
        let lastTransaction = this.transactions[this.transactions.length - 1];

        return new Date(lastTransaction.getDate());
>>>>>>> e1ace64... Docker updates
    }

    private generateHash() : string
    {
        let transactionHashes = "";

        this.transactions.forEach(transaction => {
            transactionHashes += transaction.getHash();
        });

        return SHA256(`${transactionHashes}${this.id}${this.nounce}${this.difficulty}${this.previousHash}${this.difficulty}${this.date}`).toString();
    }
}