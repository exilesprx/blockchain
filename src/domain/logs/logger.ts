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
