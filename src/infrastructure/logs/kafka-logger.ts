import { logLevel } from 'kafkajs';
import Logger from './logger';

export default class KafkaLogger {
  private logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;
  }

  public static toWinstonLogLevel(level: any) : string {
    switch (level) {
      case logLevel.ERROR:
      case logLevel.NOTHING:
        return 'error';
      case logLevel.WARN:
        return 'warn';
      case logLevel.DEBUG:
        return 'debug';
      case logLevel.INFO:
      default:
        return 'info';
    }
  }

  public logCreator(info: any) : void {
    const { level, log } = info;
    const { message, ...extra } = log;

    this.logger.log({
      level: KafkaLogger.toWinstonLogLevel(level),
      message,
      extra,
    });
  }
}
