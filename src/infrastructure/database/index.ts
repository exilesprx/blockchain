import { EventData, EventStoreDBClient } from '@eventstore/db-client';

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

  public async persist(event: EventData) {
    if (!this.client) {
      return;
    }

    await this.client.appendToStream(event.type, event);
  }
}
