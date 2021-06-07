import TransactionPool from "../wallet/transaction-pool";

export default class NewBlockPolicy
{
    private static blockLimit = 20;

    public static shouldCreateNewBlock(pool: TransactionPool) : boolean
    {
        return pool.length() == this.blockLimit;
    }
}