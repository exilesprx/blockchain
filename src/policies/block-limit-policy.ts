import Blockchain from "../chain/blockchain";

export default class BlockLimitPolicy
{
    private static limit = 10;

    public static reachedLimit(chain: Blockchain) : boolean
    {
        return chain.length() == this.limit;
    }
}