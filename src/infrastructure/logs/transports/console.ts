import Transport from "winston-transport";
import { consola } from "consola";

export default class Console extends Transport {
  public constructor(options?: Transport.TransportStreamOptions) {
    super(options);
  }

  public log(info: any, callback: () => void) {
    consola.log({ message: info.message, level: info.level, type: info.type });
    callback();
  }
}
