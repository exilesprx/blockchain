import winston, { LogEntry, Logger as WinstonLogger } from 'winston';

export default class Logger {
  private logger: WinstonLogger;

  public constructor(transports: any[]) {
    this.logger = winston.createLogger({
      exitOnError: false,
      format: winston.format.combine(winston.format.errors({ stack: true })),
      transports: transports
    });
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public log(entry: LogEntry): void {
    this.logger.log(entry);
  }

  public error(message: string): void {
    this.logger.error(message);
  }
}
