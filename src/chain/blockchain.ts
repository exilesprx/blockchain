import { Producer } from "kafkajs";
import uuid from 'uuid';
import Transaction from "../wallet/transaction";
import Block from "./block";

export default class Blockchain
{
    private static limit: number = 10;
    private chain: Block[];
    private producer: Producer;

    constructor(producer: Producer)
    {
        this.producer = producer;
        this.chain = [Block.genesis()];
    }

    public addBlock(transactions: Transaction[]) : void
    {
        if (this.chain.length == Blockchain.limit) {
            this.chain.shift();
        }

        const block = new Block(uuid.v4(), 0, 0, this.getLastBlockHash(), transactions);

        this.chain.push(block);

        this.producer.send({
            topic: 'block-test',
            messages: [
                { key: block.getKey(), value: JSON.stringify(block) },
            ]
        });
    }

    private getLastBlockHash() : string
    {
        const block = this.chain[this.chain.length - 1];

        return block.getHash();
    }
}