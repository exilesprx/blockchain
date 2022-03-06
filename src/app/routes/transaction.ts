import { Response, Request } from "express";
import Bank from "../../domain/bank";
import { logger } from "../../domain/logs/logger";
import { default as TransactionDataModel } from "../../domain/wallet/transaction";

export default class Transaction
{
    public static getName() : string
    {
        return "/transaction";
    }

    public static getAction(bank: Bank) : (req: Request, res: Response) => Response<any, Record<string, any>>
    {
        return (req: Request, res: Response) => {
            const params = req.body;
        
            try {
                // Create a new transaction, add it to the pool, and broadcast it
                const transaction = new TransactionDataModel(params.to, params.from, params.amount);
                
                bank.addTransaction(transaction);
        
                return res.send(`Transaction ${transaction.getKey()} accepted.`);
            } catch(error) {
                logger.error(`Error occurred: ${error}`)
                return res.sendStatus(401);
            }
        }
    }
}