import EventEmitter from 'events';
import { Logger, Producer } from 'kafkajs';
import Block from '../chain/block';
import Topic from '../stream/topic/topic';
import Transaction from '../wallet/transaction';

export default class Events extends EventEmitter
{
    private producer: Producer
    private logger: Logger;

    constructor(producer: Producer, logger: Logger)
    {
        super();

        this.producer = producer;

        this.logger = logger;
    }

    public static register(producer: Producer, logger: Logger) : Events
    {
        const events = new this(producer, logger);

        events.on('block-added', events.blockAdded);

        events.on('transaction-added', events.transactionAdded);

        return events;
    }

    public blockAdded(block: Block)
    {
        this.logger.info("BLock added" + block.getHash());

        // this.producer.send({
        //     topic: Topic.new('block-test').toString(),
        //     messages: [
        //         { key: block.getKey(), value: JSON.stringify(block) },
        //     ]
        // });
    }

    public transactionAdded(transaction: Transaction)
    {
        this.logger.info('Transaction added' + transaction.getHash());

        // this.producer.send({
        //     topic: Topic.new('transaction-test').toString(),
        //     messages: [
        //         { key: transaction.getKey(), value: JSON.stringify(transaction) },
        //     ],
        // });
    }
}