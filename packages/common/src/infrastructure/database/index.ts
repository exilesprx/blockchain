import { EventData, KurrentDBClient } from '@kurrent/kurrentdb-client';

export default class Database {
  private client: KurrentDBClient | null;
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
    this.client = KurrentDBClient.connectionString`kurrentdb://${this.host}:${this.port}?tls=${!this.insecure}`;
  }

  public async persist(event: EventData) {
    if (!this.client) {
      return;
    }
    await this.client.appendToStream(event.type, event);
  }
}
