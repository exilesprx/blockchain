import { EventData, EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import TransactionEvent from './models/transaction';
import Transaction from '../../domain/wallet/transaction';

export default class Database {
  private client: EventStoreDBClient | null;

  private host: string;

  private port: number;

  private insecure: boolean;

  constructor(host: string, port: number, insecure: boolean) {
    this.host = host;

    this.port = port;

    this.client = null;

    this.insecure = insecure;
  }

  public connect() {
    this.client = new EventStoreDBClient(
      {
        endpoint: `${this.host}:${this.port}`,
      },
      {
        insecure: this.insecure,
      },
    );
  }

  public async persistTransaction(transaction: Transaction) {
    if (!this.client) {
      return;
    }

    const event = jsonEvent<TransactionEvent>({
      type: 'transaction',
      data: {
        id: transaction.getKey(),
        to: transaction.getReceiver(),
        from: transaction.getSender(),
        amount: transaction.getAmount(),
        date: transaction.getDate(),
        hash: transaction.getHash(),
      },
    });

    await this.client.appendToStream(event.type, event);
  }

  public async persist(event: EventData) {
    if (!this.client) {
      return;
    }

    await this.client.appendToStream(event.type, event);
  }
}
