import Block from "./block";
import BlockLimitPolicy from "../policies/block-limit-policy";

export default class Blockchain
{
    private chain: Block[];

    constructor()
    {
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