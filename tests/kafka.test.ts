import { logLevel } from 'kafkajs';
import logger from '../src/domain/logs/logger';
import { toWinstonLogLevel, logCreator } from '../src/domain/stream/kafka';

jest.mock('../src/logs/logger');

describe('Kafka', () => {
  test('it expects the level to be debug', () => {
    const level = toWinstonLogLevel(logLevel.DEBUG);

    expect(level).toBe('debug');
  });

  test('it expects the level to be error', () => {
    const level = toWinstonLogLevel(logLevel.ERROR);

    expect(level).toBe('error');
  });

  test('it expects the level to be info', () => {
    const level = toWinstonLogLevel(logLevel.INFO);

    expect(level).toBe('info');
  });

  test('it expects the level to be error', () => {
    const level = toWinstonLogLevel(logLevel.NOTHING);

    expect(level).toBe('error');
  });

  test('it expects the level to be warn', () => {
    const level = toWinstonLogLevel(logLevel.WARN);

    expect(level).toBe('warn');
  });

  test('it expects the level to be info', () => {
    const level = toWinstonLogLevel(null);

    expect(level).toBe('info');
  });

  test('it expects', () => {
    const arg = {
      namespace: 'a',
      level: 'info',
      label: 'test',
      log: {
        message: 'test',
        comment: 'this is testing',
      },
    };

    logCreator(arg);

    expect(logger.log).toBeCalledWith(
      {
        extra: {
          comment: arg.log.comment,
        },
        level: arg.level,
        message: arg.log.message,
      },
    );
  });
});
