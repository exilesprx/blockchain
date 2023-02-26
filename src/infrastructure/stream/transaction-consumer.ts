import { EachMessagePayload } from 'kafkajs';
import TransactionTranslator from './translators/transaction-translator';
import AddTransaction from '../../app/commands/add-transaction-from-consumer';
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

    const transaction = TransactionTranslator.fromMessage(value);

    this.action.execute(transaction);
  }
}
