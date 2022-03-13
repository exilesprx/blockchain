import EventEmitter from 'events';
import Producer from '../stream/producer';
import Block from '../chain/block';
import Transaction from '../wallet/transaction';
import { Logger } from 'winston';

export default class Events
{
    private producer: Producer

    private logger: Logger;

    private emitter: EventEmitter;

    constructor(emitter: EventEmitter, producer: Producer, logger: Logger)
    {
        this.emitter = emitter;

        this.producer = producer;

        this.logger = logger;
    }

    public static register(emitter: EventEmitter, producer: Producer, logger: Logger) : Events
    {
        const events = new this(emitter, producer, logger);

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
    }

    public transactionAdded(transaction: Transaction)
    {
        this.logger.info(`Transaction added: ${transaction.getHash()}`);

        this.producer.send('transaction-added', transaction);
    }
}