import { describe, expect, jest, test } from "@jest/globals";

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
    const action = {
      execute: jest.fn(),
    } as unknown as AddTransactionFromRequest;
    const actionSpy = jest.spyOn(action, "execute");
    const logger = {} as Logger;
    const route = new TransactionRoute(action, logger);
    const req = { body: { to: "one", from: "two" } } as Request;
    const res = { send: jest.fn(() => 200) } as unknown as Response;

    expect(route.getAction(req, res)).toBe(200);
    expect(actionSpy).toHaveBeenCalledTimes(1);
  });

  test("it expects to send a 401 response when request is missing data", () => {
    const route = new TransactionRoute(
      { execute: jest.fn() } as unknown as AddTransactionFromRequest,
      { error: jest.fn() } as unknown as Logger,
    );
    const req = {} as Request;
    const res = { sendStatus: jest.fn(() => 401) } as unknown as Response;

    expect(route.getAction(req, res)).toBe(401);
  });
});
