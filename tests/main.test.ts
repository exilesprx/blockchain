import { describe, expect, jest, test } from "@jest/globals";
import Application from "../src/app/bank/main";
import TransactionRoute from "../src/app/routes/transaction";
import Server from "../src/app/server";
import Database from "../src/infrastructure/database";
import Blockchain from "../src/domain/chain/blockchain";
import Link from "../src/domain/chain/specifications/link";
import Emitter from "../src/app/events/abstract-emitter";
import Consumer from "../src/infrastructure/stream/consumer";
import Producer from "../src/infrastructure/stream/producer";
import Amount from "../src/domain/wallet/specifications/amount";
import Receiver from "../src/domain/wallet/specifications/receiver";
import SameWallet from "../src/domain/wallet/specifications/same-wallet";
import Sender from "../src/domain/wallet/specifications/sender";
import TransactionPool from "../src/domain/wallet/transaction-pool";
import BlockMined from "../src/domain/chain/specifications/mined";

jest.mock("../src/app/events/abstract-emitter");
jest.mock("../src/domain/wallet/transaction-pool");
jest.mock("../src/domain/chain/blockchain");
jest.mock("../src/infrastructure/database");
jest.mock("../src/infrastructure/stream/producer");
jest.mock("../src/infrastructure/stream/consumer");
jest.mock("../src/app/routes/transaction");
jest.mock("../src/app/server");

describe("Main", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test("it expects events to be registered", () => {
    const application = new Application();
    const emitter = jest.mocked(Emitter).mock.instances[0];

    application.registerEvents();

    expect(emitter.register).toHaveBeenCalledTimes(1);
    expect(emitter.register).toHaveBeenCalledWith(
      "TransactionAdded",
      expect.any(Function),
    );
  });

  test("it expects specifications added", () => {
    const application = new Application();
    const server = jest.mocked(Server).mock.instances[0];
    const pool = jest.mocked(TransactionPool).mock.instances[0];
    const chain = jest.mocked(Blockchain).mock.instances[0];

    application.init();

    expect(server.use).toHaveBeenCalledTimes(1);
    expect(pool.addSpecification).toHaveBeenCalledWith(
      expect.any(Amount),
      expect.any(Receiver),
      expect.any(Sender),
      expect.any(SameWallet),
    );
    expect(chain.addSpecification).toHaveBeenCalledTimes(1);
    expect(chain.addSpecification).toHaveBeenCalledWith(
      expect.any(Link),
      expect.any(BlockMined),
    );
  });

  test("it expects connections for database, producer, and consumer", async () => {
    const application = new Application();
    const database = jest.mocked(Database).mock.instances[0];
    const producer = jest.mocked(Producer).mock.instances[0];
    const consumer = jest.mocked(Consumer).mock.instances[0];
    const server = jest.mocked(Server).mock.instances[0];

    await application.boot();

    expect(database.connect).toHaveBeenCalled();
    expect(producer.connect).toHaveBeenCalled();
    expect(consumer.connect).toHaveBeenCalled();
    expect(consumer.run).toHaveBeenCalled();
    expect(server.create).toHaveBeenCalledTimes(1);
  });

  test("it expects routes to be registered", () => {
    const application = new Application();
    const server = jest.mocked(Server).mock.instances[0];
    jest.mocked(TransactionRoute).getName = jest.fn(() => "test");

    application.registerRoutes();

    expect(server.post).toHaveBeenCalledWith("test", expect.any(Function));
  });
});
