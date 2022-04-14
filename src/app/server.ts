import express, { Express } from 'express';
import { Server as HttpServer } from 'http';
import Logger from '../domain/logs/logger';

export default class Server {
  private framework: Express;

  private logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;

    this.framework = express();
  }

  public use({ handlers = [] }: { handlers?: any[]; } = {}) : void {
    this.framework.use(handlers);
  }

  public create() : HttpServer {
    return this.framework.listen(process.env.APP_PORT, this.onConnect.bind(this));
  }

  public post(path: string, ...handlers: any) : void {
    this.framework.post(path, handlers);
  }

  public get(path: string, ...handlers: any) : void {
    this.framework.get(path, handlers);
  }

  private onConnect() : void {
    this.logger.info(`App listening on port ${process.env.APP_PORT}`);
  }
}
