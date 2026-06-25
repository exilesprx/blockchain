import { logLevel } from 'kafkajs';
import Logger from '@blockchain/common/infrastructure/logs/logger';

const LogLevelDescriptions: { [index in logLevel]: string } = {
  [logLevel.NOTHING]: 'error',
  [logLevel.ERROR]: 'error',
  [logLevel.WARN]: 'warn',
  [logLevel.INFO]: 'info',
  [logLevel.DEBUG]: 'debug'
};

export default class KafkaLogger {
  private logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;
  }

  public static toWinstonLogLevel(level: logLevel): string {
    return (
      LogLevelDescriptions[level] ?? 'info'
    );
  }

  public logCreator(info: { level: logLevel; log: { message: string; [key: string]: unknown } }): void {
    const { level, log } = info;
    const { message, ...extra } = log;
    this.logger.log({
      level: KafkaLogger.toWinstonLogLevel(level),
      message,
      extra
    });
  }
}
