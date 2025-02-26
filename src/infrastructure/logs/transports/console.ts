import Transport from 'winston-transport';
import { consola } from 'consola';
import { LogEntry } from 'winston';

export default class Console extends Transport {
  public constructor(options?: Transport.TransportStreamOptions) {
    super(options);
  }

  public log(info: LogEntry, callback: () => void) {
    consola.log({ message: info.message, type: info.level, level: 2 });
    callback();
  }
}
