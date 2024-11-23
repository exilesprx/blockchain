import { describe, expect, jest, test } from "@jest/globals";

import express from "express";
import Server from "../src/app/server";

jest.mock("express");

describe("Server", () => {
  beforeAll(() => {});
  test("it expects to accept handlers are passed to the express framework", () => {
    const handler = jest.fn();
    const use = jest.fn();
    jest
      .mocked<typeof express>(express)
      .mockImplementation(() => ({ use: use }));
    const server = new Server(process.env.APP_PORT);

    server.use(handler);

    expect(use).toHaveBeenCalledWith(expect.arrayContaining([handler]));
  });

  test("it expects to call with a port and a callback", () => {
    const spy = jest.fn();
    const listen = jest.fn();
    jest
      .mocked<typeof express>(express)
      .mockImplementation(() => ({ listen: listen }));
    const server = new Server(process.env.APP_PORT);

    server.create(spy);

    expect(listen).toHaveBeenCalledWith("8888", spy);
  });

  test("it expects to accept multiple handlers for post calls", () => {
    const handlers: any[] = [jest.fn(), jest.fn()];
    const post = jest.fn();
    jest
      .mocked<typeof express>(express)
      .mockImplementation(() => ({ post: post }));
    const server = new Server(process.env.APP_PORT);

    server.post("test", handlers.at(0), handlers.at(1));

    expect(post).toHaveBeenCalledWith(
      "test",
      expect.arrayContaining([handlers.at(0), handlers.at(1)]),
    );
  });

  test("it expects to accept multiple handlers for get calls", () => {
    const handlers: any[] = [jest.fn(), jest.fn()];
    const get = jest.fn();
    jest
      .mocked<typeof express>(express)
      .mockImplementation(() => ({ get: get }));
    const server = new Server(process.env.APP_PORT);

    server.get("test", handlers.at(0), handlers.at(1));

    expect(get).toHaveBeenCalledWith(
      "test",
      expect.arrayContaining([handlers.at(0), handlers.at(1)]),
    );
  });

  test("it expects an exception if port is undefined", () => {
    const server = new Server(undefined);

    expect(() => server.getPort()).toThrow(Error);
    expect(() => server.getPort()).toThrow("Port is not configured");
  });
});
