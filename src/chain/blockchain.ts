import { Consumer } from "kafkajs";
import { v4 } from 'uuid';
import Transaction from "../wallet/transaction";
import Block from "./block";
import BlockLimitPolicy from "../policies/block-limit-policy";
import Events from "../events/emitter";
import NewBlockPolicy from "../policies/new-block-policy";

export default class Blockchain
{
    private chain: Block[];
    private events: Events;

    constructor(events: Events)
    {
        this.events = events;
        this.chain = [Block.genesis()];
    }

    public addBlock(transactions: Transaction[]) : boolean
    {
        if (! NewBlockPolicy.shouldCreateNewBlock(transactions)) {
           return false;
        }
        
        if (BlockLimitPolicy.reachedLimit(this)) {
            this.chain.shift();
        }

        const block = new Block(v4(), 0, 0, this.getLastBlockHash(), transactions);

        this.chain.push(block);

        this.events.emit('block-added', block);

        return true;
    }

    public async restore(consumer: Consumer)
    {
        // I'm thinking - instead pull the last block from the database and then fetch the transactions too
        // TODO: In the event the app crashes, grab the last X blocks and put them on the chain
        // There are two chains... a invalid chain and a valid chain. They have separate streams

        // await consumer.connect();
        
        // await consumer.subscribe({ topic: this.topic.toString(), fromBeginning: true });
        
        // await consumer.run({
        //     eachMessage: async ({ topic, partition, message }) => {
        //         // console.log('*******');
        //         const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
        //         console.log(`- ${prefix} ${message.key}#${message.value}`)
        //     },
        // });

        // consumer.seek({topic: this.topic.toString(), partition: 0, offset: '0'});
       
        // console.log('disconnect')
    }

    public length() : number
    {
        return this.chain.length;
    }

    private getLastBlockHash() : string
    {
        const block = this.chain[this.chain.length - 1];

        return block.getHash();
    }
}