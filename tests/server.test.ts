import express from "express";
import Server from "../src/app/server";

jest.mock("express");

const expressUse = jest.fn();

const expressListen = jest.fn();

const expressPost = jest.fn();

const expressGet = jest.fn();

describe("Server", () => {
  beforeAll(() => {
    express.mockImplementation(() => ({
      use: expressUse,
      listen: expressListen,
      post: expressPost,
      get: expressGet,
    }));
  });
  test("it expects to accept handlers are passed to the express framework", () => {
    const handler = jest.fn();

    const server = new Server(process.env.APP_PORT);

    server.use(handler);

    expect(expressUse).toHaveBeenCalledTimes(1);

    expect(expressUse).toHaveBeenCalledWith(expect.arrayContaining([handler]));
  });

  test("it expects to call with a port and a callback", () => {
    const server = new Server(process.env.APP_PORT);

    const spy = jest.fn();

    server.create(spy);

    expect(expressListen).toHaveBeenCalled();

    expect(expressListen).toHaveBeenCalledWith("8888", expect.any(Function));
  });

  test("it expects to accept multiple handlers for post calls", () => {
    const server = new Server(process.env.APP_PORT);

    const handlers: any[] = [jest.fn(), jest.fn()];

    server.post("test", handlers.at(0), handlers.at(1));

    expect(expressPost).toHaveBeenCalledTimes(1);

    expect(expressPost).toHaveBeenCalledWith(
      "test",
      expect.arrayContaining([handlers.at(0), handlers.at(1)]),
    );
  });

  test("it expects to accept multiple handlers for get calls", () => {
    const server = new Server(process.env.APP_PORT);

    const handlers: any[] = [jest.fn(), jest.fn()];

    server.get("test", handlers.at(0), handlers.at(1));

    expect(expressGet).toHaveBeenCalledTimes(1);

    expect(expressGet).toHaveBeenCalledWith(
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
