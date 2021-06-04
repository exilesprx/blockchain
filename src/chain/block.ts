import { SHA256 } from "crypto-js";
import { v4 } from 'uuid';
import Transaction from "../wallet/transaction";

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
        return new this(v4(), 0, 0, "00", []);
    }

    public getHash() : string
    {
        return this.hash;
    }

    public getKey() : any
    {
        return this.id;
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