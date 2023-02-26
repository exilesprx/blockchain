import { logLevel } from 'kafkajs';
import Logger from '../src/infrastructure/logs/logger';
import KafkaLogger from '../src/infrastructure/logs/kafka-logger';

jest.mock('../src/infrastructure/logs/logger');

const logger: Logger = new Logger();

const kafkaLogger: KafkaLogger = new KafkaLogger(logger);

describe('Kafka Logger', () => {
  beforeAll(() => {
    Logger.mockClear();
  });

  test('it expects the level to be debug', () => {
    const level = KafkaLogger.toWinstonLogLevel(logLevel.DEBUG);

    expect(level).toBe('debug');
  });

  test('it expects the level to be error', () => {
    const level = KafkaLogger.toWinstonLogLevel(logLevel.ERROR);

    expect(level).toBe('error');
  });

  test('it expects the level to be info', () => {
    const level = KafkaLogger.toWinstonLogLevel(logLevel.INFO);

    expect(level).toBe('info');
  });

  test('it expects the level to be error', () => {
    const level = KafkaLogger.toWinstonLogLevel(logLevel.NOTHING);

    expect(level).toBe('error');
  });

  test('it expects the level to be warn', () => {
    const level = KafkaLogger.toWinstonLogLevel(logLevel.WARN);

    expect(level).toBe('warn');
  });

  test('it expects the level to be info', () => {
    const level = KafkaLogger.toWinstonLogLevel(null);

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

    kafkaLogger.logCreator(arg);

    expect(logger.log).toBeCalledTimes(1);

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
