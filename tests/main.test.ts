import Emitter from '../src/domain/events/emitter';
import Application from '../src/app/main';

jest.mock('../src/domain/events/emitter');

describe('Main', () => {
  beforeAll(() => {
    Emitter.mockClear();
  });

  test('it expect events to be registered', () => {
    const application = new Application();

    application.registerEvents();

    expect(Emitter.mock.instances[0].register).toBeCalledTimes(2);

    expect(Emitter.mock.instances[0].register).toBeCalledWith('block-added', expect.any(Function));

    expect(Emitter.mock.instances[0].register).toBeCalledWith('transaction-added', expect.any(Function));
  });
});
