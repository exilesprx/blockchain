import { H3Event, readBody, setResponseStatus } from 'h3';
import Logger from '@blockchain/common/infrastructure/logs/logger';
import AddTransactionFromRequest from '@blockchain/common/commands/add-transaction-from-request';
import TransactionRequestTranslator from '@blockchain/common/translators/transaction-request-translator';

export default class Transaction {
  private action: AddTransactionFromRequest;
  private logger: Logger;

  public constructor(action: AddTransactionFromRequest, logger: Logger) {
    this.action = action;
    this.logger = logger;
  }

  public static getName(): string {
    return '/transaction';
  }

  public async getAction(event: H3Event): Promise<object> {
    try {
      let body = await readBody(event);

      // Create a new transaction, add it to the pool, and broadcast it
      const transaction = TransactionRequestTranslator.fromRequest(
        body.to,
        body.from,
        body.amount
      );
      const hash = this.action.execute(transaction);

      return { message: `Transaction ${hash} accepted.` };
    } catch (error) {
      this.logger.error(`Error occurred: ${error}`);
      setResponseStatus(event, 400);
      return {};
    }
  }
}
