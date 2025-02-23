import {
  App,
  Router,
  EventHandler,
  H3Event,
  createApp,
  createRouter,
  defineEventHandler,
} from "h3";

export type ServerHooks = {
  onError?: (error: Error) => void;
  onRequest?: (event: H3Event) => void;
  debug: boolean;
};

export default class Server {
  private framework: App;
  private router: Router;

  public constructor(options?: ServerHooks) {
    this.framework = createApp(options);
    this.router = createRouter();
    this.framework.use(this.router);
  }

  public use(...handlers: any[]): void {
    this.framework.use(handlers);
  }

  public post(path: string, handlers: EventHandler[]): void {
    handlers.map((handler) =>
      this.router.post(path, defineEventHandler(handler)),
    );
  }

  public get(path: string, handlers: EventHandler[]): void {
    handlers.map((handler) =>
      this.router.get(path, defineEventHandler(handler)),
    );
  }

  public instance(): App {
    return this.framework;
  }
}
