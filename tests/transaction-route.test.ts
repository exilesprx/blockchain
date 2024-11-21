import TransactionRoute from "../src/app/routes/transaction";
import Logger from "../src/infrastructure/logs/logger";
import AddTransactionFromRequest from "../src/app/commands/add-transaction-from-request";
import TransactionPool from "../src/domain/wallet/transaction-pool";
import TransactionEventRepository from "../src/infrastructure/repositories/transaction-events";

jest.mock("../src/infrastructure/database/index");
jest.mock("../src/infrastructure/logs/logger");
jest.mock("../src/app/commands/add-transaction-from-request");

describe("Transaction route", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test("it expects to add a transition to the bank and persist it", () => {
    const action = new AddTransactionFromRequest(jest.fn(), jest.fn());
    const actionSpy = jest.spyOn(action, "execute");
    const route = new TransactionRoute(action, jest.fn());
    const res = {
      send: jest.fn(),
      sendStatus: () => {},
    };
    const req = {
      body: {
        to: "test",
        from: "test",
        amount: 1,
      },
    };

    route.getAction(req, res);

    expect(actionSpy).toHaveBeenCalled();
  });

  test("it expects to aend a 401 response", () => {
    const action = new AddTransactionFromRequest(jest.fn(), jest.fn());
    const log = new Logger();
    const spy = jest.fn();
    const route = new TransactionRoute(action, log);
    const res = {
      sendStatus: spy,
    };
    const req = {};

    route.getAction(req, res);

    expect(spy).toHaveBeenCalledWith(401);
  });
});
