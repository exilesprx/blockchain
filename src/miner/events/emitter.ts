import EventEmitter from 'events';
import { Logger, Producer } from 'kafkajs';
import Block from '../../domain/chain/block';
import Topic from '../../domain/stream/topic/topic';

export default class Events {
  private producer: Producer;

  private logger: Logger;

  private emitter: EventEmitter;

  constructor(emitter: EventEmitter, producer: Producer, logger: Logger) {
    this.emitter = emitter;

    this.producer = producer;

    this.logger = logger;
  }

  public static register(emitter: EventEmitter, producer: Producer, logger: Logger) : Events {
    const events = new this(emitter, producer, logger);

    emitter.on('block-mined', events.blockMined);

    return events;
  }

  public emit(event: string, value: any) : void {
    this.emitter.emit(event, value);
  }

  public blockMined(block: Block) {
    this.logger.info(`Block mined: ${block.getHash()}`);

    this.producer.send({
      topic: Topic.new('block-mined').toString(),
      messages: [
        { key: block.getKey(), value: JSON.stringify(block) },
      ],
    });
  }
}
