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

    const { to, from, amount }: any = JSON.parse(value.toString());

    // TODO: need to pass date and hash
    const transaction = new Transaction(
      to,
      from,
      amount,
    );

    this.action.execute(transaction);
  }
}
