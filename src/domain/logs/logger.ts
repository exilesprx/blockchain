import winston, { LogEntry, Logger as WinstonLogger } from 'winston';

export default class Logger {
  private logger: WinstonLogger;

  public constructor() {
    this.logger = winston.createLogger({
      format: winston.format.cli({ colors: { info: 'yellow', error: 'red' } }),
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public log(entry: LogEntry) {
    this.logger.log(entry);
  }
}
