import { SHA256 } from "crypto-js";
import uuid from "uuid";
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


    constructor(transactions: Transaction[], previousHash: string)
    {
        this.transactions = transactions;
        this.id = uuid.v4();
        this.nounce = 0;
        this.difficulty = 10;
        this.previousHash = previousHash;
        this.date = Date.now();
        this.hash = this.generateHash();
    }

    static genesis() : Block
    {
        return new this([], "00");
    }

    private generateHash() : string
    {
        let transactionHashes = "";

        this.transactions.forEach(transaction => {
            transactionHashes += transaction.getHash();
        });

        return SHA256(`${transactionHashes}${this.id}${this.nounce}${this.difficulty}${this.previousHash}${this.difficulty}`).toString();
    }

    public getHash() : string
    {
        return this.hash;
    }

    public getKey() : any
    {
        return this.id;
    }
}