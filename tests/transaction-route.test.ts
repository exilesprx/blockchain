import TransactionRoute from '../src/app/routes/transaction';
import Database from '../src/infrastructure/database/index';
import Logger from '../src/domain/logs/logger';
import AddTransaction from '../src/app/commands/add-transaction';

jest.mock('../src/infrastructure/database/index');
jest.mock('../src/domain/logs/logger');
jest.mock('../src/app/commands/add-transaction');

describe('Transaction route', () => {
  beforeAll(() => {
    Database.mockClear();

    AddTransaction.mockClear();

    Logger.mockClear();
  });

  test('it expects to add a transition to the bank and persist it', () => {
    const action = new AddTransaction(jest.fn(), jest.fn());
    const route = new TransactionRoute(action, jest.fn());
    const res = {
      send: jest.fn(),
      sendStatus: () => {},
    };

    const req = {
      body: {
        to: 'test',
        from: 'test',
        amount: 1,
      },
    };

    route.getAction(req, res);

    expect(AddTransaction.mock.instances[0].execute).toBeCalled();
  });

  test('it expects to aend a 401 response', () => {
    const action = new AddTransaction(jest.fn(), jest.fn());
    const log = new Logger();
    const spy = jest.fn();
    const route = new TransactionRoute(action, log);
    const res = {
      sendStatus: spy,
    };

    const req = {};

    route.getAction(req, res);

    expect(spy).toBeCalledWith(401);
  });
});
