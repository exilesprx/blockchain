import dgram from 'node:dgram';
import Transport from 'winston-transport';
import { env } from 'std-env';

enum GelfLogLevels {
  emergency = 0,
  alert = 1,
  critical = 2,
  error = 3,
  warning = 4,
  notice = 5,
  info = 6,
  debug = 7
}

export default class GelfTransport extends Transport {
  private client: dgram.Socket;

  public constructor(options?: Transport.TransportStreamOptions) {
    super(options);
    this.client = dgram.createSocket('udp4');
  }

  public log(info: { message: string; level: string; extra?: Record<string, unknown> }, callback: () => void): void {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const payload = JSON.stringify({
      version: '1.1',
      host: env.HOSTNAME ?? 'unknown',
      short_message: info.message,
      level: GelfTransport.toGelfLogLevel(info.level),
      _facility: env.APP_NAME ?? 'unknown',
      ...info.extra
    });

    const buf = Buffer.from(payload);

    this.client.send(
      buf,
      0,
      buf.length,
      Number(env.GRAYLOG_PORT),
      env.GRAYLOG_HOST
    );

    callback();
  }

  private static toGelfLogLevel(level: string): number {
    return (
      GelfLogLevels[level as keyof typeof GelfLogLevels] ?? GelfLogLevels.info
    );
  }
}
