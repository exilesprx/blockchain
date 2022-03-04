import { EventStoreDBClient, JSONEventType } from "@eventstore/db-client";
import { logger } from '../logs/logger'

export default class Database
{
    private client: EventStoreDBClient;

    private host: string;

    private port: number;

    constructor(host: string, port: number)
    {
        this.host = host;

        this.port = port;
    }

    public connect()
    {
        this.client = new EventStoreDBClient({
            endpoint: `${this.host}:${this.port}`,
        });
    }

    public persistEvent(event: JSONEventType)
    {
        this.client.appendToStream(event.type, event);

        logger.info(`Persisted ${event}`);
    }
}