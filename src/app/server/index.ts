import { Server as HttpServer } from "http";
import express, { Express } from "express";

export default class Server {
  private framework: Express;
  private port: String | undefined;

  public constructor(port: String | undefined) {
    this.framework = express();
    this.port = port;
  }

  public use(...handlers: any[]): void {
    this.framework.use(handlers);
  }

  public create(onConnect: () => void): HttpServer {
    return this.framework.listen(this.port, onConnect);
  }

  public post(path: string, ...handlers: any): void {
    this.framework.post(path, handlers);
  }

  public get(path: string, ...handlers: any[]): void {
    this.framework.get(path, handlers);
  }

  public getPort(): String {
    if (this.port === undefined) {
      throw new Error("Port is not configured");
    }
    return this.port;
  }
}
