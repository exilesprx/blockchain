import { EachMessagePayload } from 'kafkajs';
import Transaction from '../../domain/wallet/transaction';
import AddTransaction from '../../miner/commands/add-transaction';
import Consumer from './consumer';
import Stream from './stream';
import TransactionTopic from './topic/transaction';

export default class TransactionConsumer extends Consumer {
  private action: AddTransaction;

  public constructor(action: AddTransaction, stream: Stream) {
    super(stream);

    this.action = action;
  }

  public async run() : Promise<void> {
    super.run(new TransactionTopic().toString());
  }

  protected async transformMessage(payload: EachMessagePayload) : Promise<void> {
    const { value } = payload.message;

    if (!value) {
      return;
    }

    const parts: any = value.toJSON();

    const transaction = new Transaction(
      parts.to,
      parts.from,
      parts.amount,
    );

    this.action.execute(transaction);
  }
}
