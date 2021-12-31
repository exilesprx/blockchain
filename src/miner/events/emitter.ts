import EventEmitter from 'events';
import { Logger, Producer } from 'kafkajs';
import Block from '../../chain/block';
import Topic from '../../stream/topic/topic';

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

        return events;
    }

    public emit(event: string, value: any) : void
    {
        this.emitter.emit(event, value);
    }

    public blockAdded(block: Block)
    {
        this.logger.info(`Block added: ${block.getHash()}`);

        this.producer.send({
            topic: Topic.new('block-added').toString(),
            messages: [
                { key: block.getKey(), value: JSON.stringify(block) },
            ]
        });
    }
}