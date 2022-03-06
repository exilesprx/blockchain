import EventEmitter from 'events';
import { Producer } from 'kafkajs';
import Block from '../chain/block';
import Database from '../../database';
import Topic from '../stream/topic/topic';
import TransactionEvent from '../../database/models/transaction';
import Transaction from '../wallet/transaction';
import { Logger } from 'winston';

export default class Events
{
    private producer: Producer

    private logger: Logger;

    private emitter: EventEmitter;

    private database: Database;

    constructor(database: Database, emitter: EventEmitter, producer: Producer, logger: Logger)
    {
        this.database = database;

        this.emitter = emitter;

        this.producer = producer;

        this.logger = logger;
    }

    public static register(database: Database, emitter: EventEmitter, producer: Producer, logger: Logger) : Events
    {
        const events = new this(database, emitter, producer, logger);

        emitter.on('block-added', events.blockAdded.bind(events));

        emitter.on('transaction-added', events.transactionAdded.bind(events));

        return events;
    }

    public emit(event: string, value: any) : void
    {
        this.emitter.emit(event, value);
    }

    public blockAdded(block: Block)
    {
        this.logger.info(`Block added: ${block.getHash()}`);

        // TODO: persist event

        block.getTransactions().forEach((transaction) => {
            // TODO: update wallets
        });
    }

    public transactionAdded(transaction: Transaction)
    {
        this.logger.info(`Transaction added: ${transaction.getHash()}`);

        this.database.persistEvent(transaction)

        // this.producer.send({
        //     topic: Topic.new('transaction-added').toString(),
        //     messages: [
        //         { key: transaction.getKey(), value: JSON.stringify(transaction) },
        //     ],
        // });
    }
}