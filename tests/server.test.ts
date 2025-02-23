import { describe, expect, jest, test } from "@jest/globals";

import { EventHandler } from "h3";
import Server from "@/app/server";

const use = jest.fn();
const get = jest.fn();
const post = jest.fn();
jest.mock("h3", () => ({
  createApp: jest.fn().mockImplementation(() => ({
    use,
  })),
  createRouter: jest.fn().mockImplementation(() => ({
    get,
    post,
  })),
  defineEventHandler: (f: any) => f,
}));

describe("Server", () => {
  beforeAll(() => {});
  test("it expects to accept handlers are passed to the express framework", () => {
    const handler = jest.fn();
    const server = new Server();

    server.use(handler);

    expect(use).toHaveBeenCalledWith(expect.arrayContaining([handler]));
  });

  test("it expects to accept multiple handlers for post calls", () => {
    const handlers: EventHandler[] = [jest.fn(), jest.fn()];
    const server = new Server();

    server.post("test", [handlers.at(0)!, handlers.at(1)!]);

    expect(post).toHaveBeenCalledWith("test", handlers.at(0));
    expect(post).toHaveBeenCalledWith("test", handlers.at(1));
  });

  test("it expects to accept multiple handlers for get calls", () => {
    const handlers: EventHandler[] = [jest.fn(), jest.fn()];
    const server = new Server();

    server.get("test", [handlers.at(0)!, handlers.at(1)!]);

    expect(get).toHaveBeenCalledWith("test", handlers.at(0));
    expect(get).toHaveBeenCalledWith("test", handlers.at(1));
  });
});
