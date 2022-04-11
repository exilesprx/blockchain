import express, { Express } from 'express';
import { Server as HttpServer } from 'http';

export default class Server {
  private framework: Express;

  public constructor() {
    this.framework = express();
  }

  public use({ handlers = [] }: { handlers?: any[]; } = {}) : void {
    this.framework.use(handlers);
  }

  public create(listeners?: any) : HttpServer {
    return this.framework.listen(process.env.APP_PORT, listeners);
  }

  public post(path: string, ...handlers: any) : void {
    this.framework.post(path, handlers);
  }

  public get(path: string, ...handlers: any) : void {
    this.framework.get(path, handlers);
  }
}
