import Logger from "gelf-pro";
import Transport from "winston-transport";

enum GelfLogLevels {
  emergency = 0,
  alert = 1,
  critical = 2,
  error = 3,
  warning = 4,
  notice = 5,
  info = 6,
  debug = 7,
}

export default class GelfTransport extends Transport {
  private gelf: Logger.Logger;

  public constructor(options?: Transport.TransportStreamOptions) {
    super(options);

    this.gelf = Logger.setConfig(GelfTransport.getConfig());
  }

  public log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const { message, extra, level } = info;
    this.gelf.message(message, GelfTransport.toGelfLogLevel(level), extra);
    callback();
  }

  private static getConfig(): Partial<Logger.Settings> {
    return {
      fields: {
        facility: `${process.env.APP_NAME}`,
        owner: `${process.env.HOSTNAME}`,
      },
      adapterName: "udp", // optional; currently supported "udp", "tcp" and "tcp-tls"; default: udp
      adapterOptions: {
        // this object is passed to the adapter.connect() method
        host: `${process.env.GRAYLOG_HOST}`, // optional; default: 127.0.0.1
        port: Number(`${process.env.GRAYLOG_PORT}`), // optional; default: 12201
      },
    };
  }

  private static toGelfLogLevel(level: string): number {
    return (
      GelfLogLevels[level as keyof typeof GelfLogLevels] || GelfLogLevels.info
    );
  }
}
