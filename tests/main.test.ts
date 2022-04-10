import express from 'express';
import Application from '../src/app/main';
import Blockchain from '../src/domain/chain/blockchain';
import Emitter from '../src/domain/events/emitter';
import TransactionPool from '../src/domain/wallet/transaction-pool';
import Database from '../src/database';
import Producer from '../src/domain/stream/producer';
import Consumer from '../src/domain/stream/consumer';

jest.mock('../src/domain/events/emitter');
jest.mock('express');
jest.mock('../src/domain/wallet/transaction-pool');
jest.mock('../src/domain/chain/blockchain');
jest.mock('../src/database');
jest.mock('../src/domain/stream/producer');
jest.mock('../src/domain/stream/consumer');

const expressUse = jest.fn();

const expressListen = jest.fn();

const addSpecForPool = jest.fn();

const addSpecForChain = jest.fn();

describe('Main', () => {
  beforeAll(() => {
    Emitter.mockClear();

    Database.mockClear();

    Producer.mockClear();

    Consumer.mockClear();

    TransactionPool.mockImplementation(() => ({
      addSpecification: addSpecForPool.mockReturnThis(),
    }));

    Blockchain.mockImplementation(() => ({
      addSpecification: addSpecForChain.mockReturnThis(),
    }));

    express.mockImplementation(() => ({
      use: expressUse,
      listen: expressListen,
    }));
  });

  test('it expect events to be registered', () => {
    const application = new Application();

    application.registerEvents();

    expect(Emitter.mock.instances[0].register).toBeCalledTimes(2);

    expect(Emitter.mock.instances[0].register).toBeCalledWith('block-added', expect.any(Function));

    expect(Emitter.mock.instances[0].register).toBeCalledWith('transaction-added', expect.any(Function));
  });

  test('it expects specifications added', () => {
    const application = new Application();

    application.init();

    expect(expressUse).toBeCalledTimes(2);

    expect(addSpecForPool).toBeCalledTimes(4);

    expect(addSpecForChain).toBeCalledTimes(1);
  });

  test('it expects connections for database, producer, and consumer', () => {
    const application = new Application();

    application.boot();

    expect(Database.mock.instances[0].connect).toBeCalled();

    expect(Producer.mock.instances[0].connect).toBeCalled();

    expect(Consumer.mock.instances[0].connect).toBeCalled();

    expect(expressListen).toBeCalledTimes(1);
  });
});
