import { Producer } from "kafkajs";
import { v4 } from 'uuid';
import Topic from "../stream/topic/topic";
import Transaction from "../wallet/transaction";
import Block from "./block";

export default class Blockchain
{
    private static limit: number = 10;
    private chain: Block[];
    private producer: Producer;
    private topic: Topic;

    constructor(producer: Producer, topic: Topic)
    {
        this.producer = producer;
        this.topic = topic;
        this.chain = [Block.genesis()];
    }

    public addBlock(transactions: Transaction[]) : void
    {
        if (this.chain.length == Blockchain.limit) {
            this.chain.shift();
        }

        const block = new Block(v4(), 0, 0, this.getLastBlockHash(), transactions);

        this.chain.push(block); console.log(`Block added ${block.getHash()}`)

        this.producer.send({
            topic: this.topic.toString(),
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