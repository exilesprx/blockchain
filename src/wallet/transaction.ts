import { v4 } from 'uuid';
import SHA256 from 'crypto-js/sha256';

export default class Transaction
{
    private to: string;
    private from: string;
    private amount: number;
    private id: any;
    private date: number;
    private hash: string;

    constructor(to: string, from: string, amount: number)
    {
        this.to = to;
        this.from = from;
        this.amount = amount;
        this.id = v4();
        this.date = Date.now();
        this.hash = this.generateHash();
    }

    private generateHash() : string
    {
        return SHA256(`${this.to}${this.from}${this.amount}${this.id}${this.date}`).toString();
    }

    public getHash() : string
    {
        return this.hash;
    }

    public getKey() : any 
    {
        return this.id;
    }

    public getSender() : string
    {
        return this.from;
    }

    public getReceiver() : string
    {
        return this.to;
    }

    public getAmount() : number
    {
        return this.amount;
    }
}