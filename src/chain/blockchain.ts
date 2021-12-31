import Block from "./block";
import Events from "../events/emitter";
import BlockLimitPolicy from "../policies/block-limit-policy";

export default class Blockchain
{
    private chain: Block[];
    private events: Events;

    constructor(events: Events)
    {
        this.events = events;
        this.chain = [Block.genesis()];
    }

    public addBlock(block: Block) : Block
    {
        if (this.getLastBlockHash() != block.getPreviousHash()) {
            throw new Error("Incorrect block reference.");
        }

        if (BlockLimitPolicy.reachedLimit(this)) {
            this.removeFirstBlock()
        }

        this.chain.push(block);

        this.events.emit('block-added', block);

        return block;
    }

    public length() : number
    {
        return this.chain.length;
    }

    private getLastBlockHash() : string
    {
        const block = this.getPreviousBlock();

        return block.getHash();
    }

    private getPreviousBlock() : Block
    {
        return this.chain[this.chain.length - 1];
    }

    private removeFirstBlock() : Block|undefined
    {
        return this.chain.shift();
    }
}