import { describe, expect, jest, test } from "@jest/globals";

import Application from "@/app/bank/main";
import TransactionRoute from "@/app/routes/transaction";
import Server from "@/app/server";
import Database from "@/infrastructure/database";
import Blockchain from "@/domain/chain/blockchain";
import Link from "@/domain/chain/specifications/link";
import Producer from "@/infrastructure/stream/producer";
import Amount from "@/domain/wallet/specifications/amount";
import Receiver from "@/domain/wallet/specifications/receiver";
import SameWallet from "@/domain/wallet/specifications/same-wallet";
import Sender from "@/domain/wallet/specifications/sender";
import TransactionPool from "@/domain/wallet/transaction-pool";
import BlockMined from "@/domain/chain/specifications/mined";

// Abstract class are mocked differently then normal classes
const emitter = {
  register: jest.fn(),
};
const consumer = {
  run: jest.fn(),
  connect: jest.fn(),
};
jest.mock("@/app/events/abstract-emitter", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => emitter),
  };
});

jest.mock("@/infrastructure/stream/consumer", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => consumer),
  };
});
// End abstract class mocks

jest.mock("@/domain/wallet/transaction-pool");
jest.mock("@/domain/chain/blockchain");
jest.mock("@/infrastructure/database");
jest.mock("@/infrastructure/stream/producer");
jest.mock("@/app/routes/transaction");
jest.mock("@/app/server");

describe("Main", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test("it expects events to be registered", () => {
    const application = new Application();

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
    jest.mocked(TransactionRoute.getName).mockImplementation(() => "test");

    application.registerRoutes();

    expect(server.post).toHaveBeenCalledWith("test", expect.any(Function));
  });
});
