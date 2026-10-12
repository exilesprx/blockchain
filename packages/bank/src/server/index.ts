import {
  H3,
  
  EventHandler,
  H3Event,
  createApp,
  createRouter,
  defineEventHandler
} from 'h3';

export type ServerHooks = {
  onError?: (error: Error) => void;
  onRequest?: (event: H3Event) => void;
  debug: boolean;
};

export default class Server {
  private framework: H3;
  private router: H3;

  public constructor(options?: ServerHooks) {
    this.framework = createApp(options);
    this.router = createRouter();
    this.framework.use(this.router.handler);
  }

  public use(...handlers: EventHandler[]): void {
    this.framework.use(handlers as any);
  }

  public post(path: string, handlers: EventHandler[]): void {
    handlers.forEach((handler) => {
      this.router.post(path, defineEventHandler(handler));
    });
  }

  public get(path: string, handlers: EventHandler[]): void {
    handlers.forEach((handler) => {
      this.router.get(path, defineEventHandler(handler));
    });
  }

  public instance(): H3 {
    return this.framework;
  }
}
