import TransactionPool from "../../wallet/transaction-pool";
import { Response, Request } from "express";

export default class Transaction
{
    public static getName() : string
    {
        return "/transaction";
    }

    public static getAction(pool: TransactionPool) : (req: Request, res: Response) => Response<any, Record<string, any>>
    {
        return (req: Request, res: Response) => {
            const params = req.body;
        
            try {
                // Create a new transaction, add it to the pool, and broadcast it
                const transaction = pool.fill(params.to, params.from, params.amount);
        
                return res.send(`Transaction ${transaction.getKey()} accepted.`);
            } catch(error) {
                return res.sendStatus(401);
            }
        }
    }
}