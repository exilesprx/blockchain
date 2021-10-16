import TransactionPool from "../../wallet/transaction-pool";
import { Response, Request } from "express";

export default class Transaction
{
    public static getAction(pool: TransactionPool)
    {
        return (req: Request, res: Response) => {
            const params = req.body;
        
            try {
                // Create a new transaction, add it to the pool, and broadcast it
                const transaction = pool.fill(params.to, params.from, params.amount);
        
                return res.send(`Transaction ${transaction.getKey()} accepted.`);
            } catch(error) {
                res.sendStatus(401);
                return;
            }
        }
    }
}