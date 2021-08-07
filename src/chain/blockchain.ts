import BlockModel from '../models/block';
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

    public async restore()
    {
        // Get the latest block
        const blockModel = await BlockModel.findOne().lean();

        if (!blockModel) {
            return;
        }

        const block = new Block(
            blockModel.id,
            blockModel.nounce,
            blockModel.difficulty,
            blockModel.previousHash,
            blockModel.transactions
        );

        if (block.getHash() != blockModel.hash) {
            throw new TypeError();
        }

        this.chain = [block];

        // TODO: Find all transaction newer than the ones in the block
        // TODO: Fill the transaction pool with the transactions found
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