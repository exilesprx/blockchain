import Block from "./block";

export default class Blockchain
{
    private static limit: number = 10;
    private chain: Block[];

    constructor()
    {
        this.chain = [Block.genesis()];
    }

    public addBlock(block: Block) : void
    {
        if (this.chain.length == Blockchain.limit) {
            this.chain.shift();
        }

        this.chain.push(block);
    }

    public getLastBlockHash() : string
    {
        const block = this.chain[this.chain.length - 1];

        return block.getHash();
    }
}