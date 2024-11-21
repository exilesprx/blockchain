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

const addSpecForPool = jest.fn();
const addSpecForChain = jest.fn();

describe("Main", () => {
  beforeAll(() => {
    Emitter.mockClear();

    Database.mockClear();

    Producer.mockClear();

    Consumer.mockClear();

    Server.mockClear();

    TransactionPool.mockImplementation(() => ({
      addSpecification: addSpecForPool,
    }));

    Blockchain.mockImplementation(() => ({
      addSpecification: addSpecForChain,
    }));

    TransactionRoute.mockImplementation(() => ({
      getAction: jest.fn(),
    }));

    TransactionRoute.getName = jest.fn().mockReturnValue("test");
  });

  test("it expect events to be registered", () => {
    const application = new Application();

    application.registerEvents();

    expect(Emitter.mock.instances[0].register).toHaveBeenCalledTimes(1);

    expect(Emitter.mock.instances[0].register).toHaveBeenCalledWith(
      "TransactionAdded",
      expect.any(Function),
    );
  });

  test("it expects specifications added", () => {
    const application = new Application();

    application.init();

    expect(Server.mock.instances[0].use).toHaveBeenCalledTimes(1);

    expect(addSpecForPool).toHaveBeenCalledTimes(1);

    expect(addSpecForPool).toHaveBeenCalledWith(
      expect.any(Amount),
      expect.any(Receiver),
      expect.any(Sender),
      expect.any(SameWallet),
    );

    expect(addSpecForChain).toHaveBeenCalledTimes(1);

    expect(addSpecForChain).toHaveBeenCalledWith(
      expect.any(Link),
      expect.any(BlockMined),
    );
  });

  test("it expects connections for database, producer, and consumer", async () => {
    const application = new Application();

    application.boot();

    expect(Database.mock.instances[0].connect).toHaveBeenCalled();

    await expect(Producer.mock.instances[0].connect).toHaveBeenCalled();

    await expect(Consumer.mock.instances[0].connect).toHaveBeenCalled();

    await expect(Consumer.mock.instances[0].run).toHaveBeenCalled();

    expect(Server.mock.instances[0].create).toHaveBeenCalledTimes(1);
  });

  test("it expects routes to be registered", () => {
    const application = new Application();

    application.registerRoutes();

    expect(Server.mock.instances[0].post).toHaveBeenCalled();

    expect(Server.mock.instances[0].post).toHaveBeenCalledWith(
      "test",
      expect.any(Function),
    );
  });
});
