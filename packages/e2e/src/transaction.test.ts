import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { KurrentDBClient, START, FORWARDS } from '@kurrent/kurrentdb-client';
import stringify from 'fast-json-stable-stringify';
import { env } from 'std-env';

const API_URL = env.API_URL ?? 'localhost:3000';
const KURRENT_URL = `kurrentdb://${env.DB_HOST}:${env.DB_PORT}?tls=${!env.DB_INSECURE}`;
let client: KurrentDBClient;

describe('Transaction', () => {
  beforeAll(async () => {
    client = KurrentDBClient.connectionString(KURRENT_URL);
  });
  afterAll(async () => {
    client.deleteStream('transaction');
  });
  it('should create a transaction', async () => {
    const result = await fetch(`http://${API_URL}/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: stringify({ amount: 100, from: 'Alice', to: 'Bob' })
    });

    expect(result.status).toBe(200);

    const events = [];
    for await (const event of client.readStream('transaction', {
      fromRevision: START,
      direction: FORWARDS
    })) {
      events.push(event);
    }

    expect(events.length).toBe(1);
    const event = events.at(0)?.event;
    if (event) {
      const { amount } = event.data as {
        amount: number;
        from: string;
        to: string;
      };
      expect(amount).toBe(100);
    } else {
      expect.fail('No event found in the transaction stream');
    }
  });
});
