import EventEmitter from 'events';
import { Logger, Producer } from 'kafkajs';
import Block from '../chain/block';
import Topic from '../stream/topic/topic';
import Transaction from '../wallet/transaction';

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

        emitter.on('block-added', events.blockAdded);

        emitter.on('transaction-added', events.transactionAdded);

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

        // TODO: persist block

        this.producer.send({
            topic: Topic.new('transaction-added').toString(),
            messages: [
                { key: transaction.getKey(), value: JSON.stringify(transaction) },
            ],
        });
    }
}