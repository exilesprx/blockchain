import { Response, Request } from 'express';
import Database from '../../database';
import Bank from '../../domain/bank';
import Logger from '../../domain/logs/logger';
import TransactionDataModel from '../../domain/wallet/transaction';

export default class Transaction {
  private database: Database;

  private bank: Bank;

  private logger: Logger;

  public constructor(database: Database, bank: Bank, logger: Logger) {
    this.database = database;

    this.bank = bank;

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

      this.bank.addTransaction(transaction);

      this.database.persistTransaction(transaction);

      return res.send(`Transaction ${transaction.getKey()} accepted.`);
    } catch (error) {
      this.logger.error(`Error occurred: ${error}`);
      return res.sendStatus(401);
    }
  }
}
