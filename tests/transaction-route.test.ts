import TransactionRoute from '../src/app/routes/transaction';
import Database from '../src/database/index';
import Bank from '../src/domain/bank';
import Logger from '../src/domain/logs/logger';

jest.mock('../src/database/index');
jest.mock('../src/domain/bank');
jest.mock('../src/domain/logs/logger');

describe('Transaction route', () => {
  beforeAll(() => {
    Database.mockClear();

    Bank.mockClear();

    Logger.mockClear();
  });

  test('it expects to add a transition to the bank and persist it', () => {
    const database = new Database('host', 8888);
    const bank = new Bank(jest.fn(), jest.fn(), jest.fn());
    const route = new TransactionRoute(database, bank, jest.fn());
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

    expect(Bank.mock.instances[0].addTransaction).toBeCalled();

    expect(Database.mock.instances[0].persistTransaction).toBeCalled();
  });

  test('it expects to aend a 401 response', () => {
    const database = new Database('host', 8888);
    const bank = new Bank(jest.fn(), jest.fn(), jest.fn());
    const log = new Logger();
    const spy = jest.fn();
    const route = new TransactionRoute(database, bank, log);
    const res = {
      sendStatus: spy,
    };

    const req = {};

    route.getAction(req, res);

    expect(spy).toBeCalledWith(401);
  });
});
