import { Request, Response } from 'express';
import Logger from '../../domain/logs/logger';
import AddTransaction from '../commands/add-transaction';
import TransactionTranslator from '../translators/transaction-translator';

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
      const transaction = TransactionTranslator.fromRequest(params);

      const hash = this.action.execute(transaction);

      return res.send(`Transaction ${hash} accepted.`);
    } catch (error) {
      this.logger.error(`Error occurred: ${error}`);
      return res.sendStatus(401);
    }
  }
}
