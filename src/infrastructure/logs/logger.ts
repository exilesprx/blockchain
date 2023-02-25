import winston, { LogEntry, Logger as WinstonLogger } from 'winston';
import GelfTransport from './transports/gelf';

export default class Logger {
  private logger: WinstonLogger;

  public constructor() {
    this.logger = winston.createLogger({
      exitOnError: false,
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
      ),
      transports: [
        new GelfTransport(),
      ],
    });
  }

  public info(message: string) : void {
    this.logger.info(message);
  }

  public log(entry: LogEntry) : void {
    this.logger.log(entry);
  }

  public error(message: string) : void {
    this.logger.error(message);
  }
}
