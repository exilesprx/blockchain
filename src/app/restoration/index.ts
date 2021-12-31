import BlockModel, { Block } from "../../models/block";

export default class Restoration
{
    // public async restore() : Promise<Transaction[]>
    // {
    //     try {

    //         let transactions = await TransactionModel.find({ "blockId": null})
    //             .sort({"created_at": 1})
    //             .lean();

    //         transactions.forEach(transactionModel => {
    //             const transaction = Transaction.fromModel(transactionModel);

    //             this.transactions.push(transaction);

    //             if (NewBlockPolicy.shouldCreateNewBlock(this.transactions)) {
    //                 this.chain.createBlock(this.transactions);
    //                 this.drain();
    //             }
    //         });

    //         return Promise.resolve(this.transactions);
    //     } catch(error) {
    //         return Promise.reject(this.transactions);
    //     }
    // }

    public async restore() : Promise<Block>
    {
        try {
            const blockModel = await BlockModel.findOne().lean();

            if (!blockModel) {
                return this.chain[0];
            }
            
            const block = Block.fromModel(blockModel);
    
            if (block.getHash() != blockModel.hash) {
                throw new TypeError();
            }
    
            this.chain = [block];

            return block;
        } catch(error) {
            return Promise.reject(error);
        }
    }
}