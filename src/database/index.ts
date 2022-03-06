import { EventData, EventStoreDBClient, jsonEvent, JSONEventData, JSONEventOptions, JSONEventType } from "@eventstore/db-client";
import { logger } from '../logs/logger'
import TransactionEvent from "../models/transaction";
import Transaction from "../wallet/transaction";

export default class Database
{
    private client: EventStoreDBClient|null;

    private host: string;

    private port: number;

    constructor(host: string, port: number)
    {
        this.host = host;

        this.port = port;

        this.client = null;
    }

    public connect()
    {
        this.client = new EventStoreDBClient({
            endpoint: `${this.host}:${this.port}`,
        },
        {
            insecure: true
        });
    }

    public async persistEvent(transaction: Transaction)
    {
        if (!this.client) {
            return;
        }

        const event = jsonEvent<TransactionEvent>({
            type: "transaction",
            data: {
                id: transaction.getKey(),
                to: transaction.getReceiver(),
                from: transaction.getSender(),
                amount: transaction.getAmount(),
                date: transaction.getDate(),
                hash: transaction.getHash()
            },
        });

        const result = await this.client.appendToStream(event.type, event);

        // logger.info(`Persisted ${event}`);
    }
}