import { EachMessagePayload } from 'kafkajs';
import TransactionTranslator from '@blockchain/common/infrastructure/stream/translators/transaction-translator';
import AddTransaction from '@blockchain/common/commands/add-transaction-from-consumer';
import Consumer from '@blockchain/common/infrastructure/stream/consumer';
import Stream from '@blockchain/common/infrastructure/stream/stream';
import TransactionTopic from '@blockchain/common/infrastructure/stream/topic/transaction';

export default class TransactionConsumer extends Consumer {
  private action: AddTransaction;

  public constructor(action: AddTransaction, stream: Stream) {
    super(stream);

    this.action = action;
  }

  public async run(): Promise<void> {
    super.run(new TransactionTopic().toString());
  }

  protected async transformMessage(payload: EachMessagePayload): Promise<void> {
    const { value } = payload.message;
    if (!value) {
      return;
    }
    const transaction = TransactionTranslator.fromMessage(value);

    this.action.execute(transaction);
  }
}
