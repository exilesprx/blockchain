import express from 'express';
import Server from '../src/app/server';
import Logger from '../src/domain/logs/logger';

jest.mock('express');
jest.mock('../src/domain/logs/logger');

const expressUse = jest.fn();

const expressListen = jest.fn();

describe('Server', () => {
  beforeAll(() => {
    express.mockImplementation(() => ({
      use: expressUse,
      listen: expressListen,
    }));

    Logger.mockClear();
  });
  test('it expects handlers are passed to the express framework', () => {
    const handler = jest.fn();

    const server = new Server(Logger.mock.instances[0]);

    server.use({ handlers: [handler] });

    expect(expressUse).toBeCalled();

    expect(expressUse).toBeCalledWith([handler]);
  });

  test('it expects to call with a port and a callback', () => {
    const server = new Server(Logger.mock.instances[0]);

    server.create();

    expect(expressListen).toBeCalled();

    expect(expressListen).toHaveBeenCalledWith('8888', expect.any(Function));
  });
});
