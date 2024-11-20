import Events from "events";
import Block from "../src/domain/chain/block";
import Emitter from "../src/app/events/emitter";
import KafkaLogger from "../src/infrastructure/logs/kafka-logger";
import Logger from "../src/infrastructure/logs/logger";
import Producer from "../src/infrastructure/stream/producer";
import Stream from "../src/infrastructure/stream/stream";
import Transaction from "../src/domain/wallet/transaction";
import MineFailed from "../src/domain/events/mine-failed";
import BlockAdded from "../src/domain/events/block-added";
import BlockMined from "../src/domain/events/block-mined";
import TransactionAdded from "../src/domain/events/transaction-added";

jest.mock("events");
jest.mock("kafkajs");
jest.mock("../src/infrastructure/logs/logger");
jest.mock("../src/infrastructure/logs/kafka-logger");
jest.mock("../src/infrastructure/stream/stream");
jest.mock("../src/infrastructure/stream/producer");

const events: Events = new Events();

const logger: Logger = new Logger();

const kafkaLogger = new KafkaLogger(logger);

const stream: Stream = new Stream(kafkaLogger);

const producer: Producer = new Producer(stream);

describe("Emitter", () => {
  beforeAll(() => {
    Events.mockClear();
    Logger.mockClear();
    Producer.mockClear();
  });

  test("it expects the listeners can be configured", () => {
    const emitter = new Emitter(events, producer, logger);
    const spy = jest.fn();

    emitter.register("test", spy);

    expect(events.on).toHaveBeenCalledWith("test", spy);
  });

  test("it expects a log and kafka message when adding a block", () => {
    const emitter = new Emitter(events, producer, logger);
    const block = new Block(1, 0, 0, "test", [], 0);
    const event = new BlockAdded(block);

    emitter.blockAdded(event);

    expect(logger.info).toHaveBeenCalledWith(`Block added: ${block.getHash()}`);
    expect(producer.sendBlock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        hash: block.getHash(),
        previousHash: "test",
      }),
    );
  });

  test("it expects a log when a block is mined", () => {
    const emitter = new Emitter(events, producer, logger);
    const block = new Block(1, 0, 0, "test", [], 0);
    const event = new BlockMined(block);

    emitter.blockMined(event);

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`${block.getKey()}`),
    );
  });

  test("it expects a log when a block fails to be mined", () => {
    const emitter = new Emitter(events, producer, logger);
    const block = new Block(1, 0, 0, "test", [], 0);
    const event = new MineFailed(block, "Failed to mine");

    emitter.mineFailed(event);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`${block.getKey()}`) &&
        expect.stringContaining("Failed to mine"),
    );
  });

  test("it expects a log and kafka message when adding a transaction", () => {
    const emitter = new Emitter(events, producer, logger);
    const transaction = new Transaction("1", "2", "50", 3, 20241119);
    const event = new TransactionAdded(transaction);

    emitter.transactionAdded(event);

    expect(producer.sendTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", to: "2", from: "50", amount: 3 }),
    );
  });

  test("it expects to call emit on EventEmitter", () => {
    const emitter = new Emitter(events, producer, logger);

    emitter.emit("test", 1);

    expect(events.emit).toHaveBeenCalledWith("test", 1);
  });
});
