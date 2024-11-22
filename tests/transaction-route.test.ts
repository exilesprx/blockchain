import TransactionRoute from "../src/app/routes/transaction";
import Logger from "../src/infrastructure/logs/logger";
import AddTransactionFromRequest from "../src/app/commands/add-transaction-from-request";
import { Request, Response } from "express";

jest.mock("../src/infrastructure/database/index");
jest.mock("../src/infrastructure/logs/logger");
jest.mock("../src/app/commands/add-transaction-from-request");
jest.mock("express");

describe("Transaction route", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test("it expects to add a transition to the bank and persist it", () => {
    const executeSpy = jest.fn();
    const action = jest.mocked<Partial<AddTransactionFromRequest>>({
      execute: executeSpy,
    }) as Partial<AddTransactionFromRequest>;
    const logger = jest.mocked<Partial<Logger>>({}) as Partial<Logger>;
    const route = new TransactionRoute(
      action as AddTransactionFromRequest,
      logger as Logger,
    );
    const req = jest.mocked<Partial<Request>>({
      body: { to: "one", from: "two" },
    });
    const res = jest.mocked<Partial<Response>>({
      send: jest.fn().mockImplementation(() => true),
    });

    expect(route.getAction(req as Request, res as Response)).toBe(true);
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  test("it expects to aend a 401 response", () => {
    const action = jest.mocked<Partial<AddTransactionFromRequest>>({
      execute: jest.fn(),
    }) as Partial<AddTransactionFromRequest>;
    const logger = jest.mocked<Partial<Logger>>({
      error: jest.fn(),
    }) as Partial<Logger>;
    const route = new TransactionRoute(
      action as AddTransactionFromRequest,
      logger as Logger,
    );
    const req = jest.mocked<Partial<Request>>({
      body: { to: "one", from: "two" },
    });
    const res = jest.mocked<Partial<Response>>({
      sendStatus: jest.fn().mockImplementation(() => 401),
    });

    expect(route.getAction(req as Request, res as Response)).toBe(401);
  });
});
