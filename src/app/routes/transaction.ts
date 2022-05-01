import { Request, Response } from 'express';
import Logger from '../../domain/logs/logger';
import TransactionDataModel from '../../domain/wallet/transaction';
import AddTransaction from '../commands/add-transaction';

export default class Transaction {
  private action: AddTransaction;

  private logger: Logger;

  public constructor(action: AddTransaction, logger: Logger) {
    this.action = action;

    this.logger = logger;
  }

  public static getName() : string {
    return '/transaction';
  }

  public getAction(req: Request, res: Response) : Response<any, Record<string, any>> {
    const params = req.body;

    try {
      // Create a new transaction, add it to the pool, and broadcast it
      const transaction = new TransactionDataModel(params.to, params.from, params.amount);

      this.action.execute(transaction);

      return res.send(`Transaction ${transaction.getKey()} accepted.`);
    } catch (error) {
      this.logger.error(`Error occurred: ${error}`);
      return res.sendStatus(401);
    }
  }
}
