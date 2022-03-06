import Transaction from "../wallet/transaction";

export default class NewBlockPolicy
{
    private static blockLimit = 20;

    public static shouldCreateNewBlock(transactions: Transaction[]) : boolean
    {
        return transactions.length == this.blockLimit;
    }

    public static getBlockLimit() : Number
    {
        return this.blockLimit;
    }
}