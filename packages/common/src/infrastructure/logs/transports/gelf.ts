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
  public log(info: any, callback: () => void): void {
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

    const client = dgram.createSocket('udp4');
    const buf = Buffer.from(payload);

    client.send(
      buf,
      0,
      buf.length,
      Number(env.GRAYLOG_PORT),
      env.GRAYLOG_HOST,
      () => {
        client.close();
      }
    );

    callback();
  }

  private static toGelfLogLevel(level: string): number {
    return (
      GelfLogLevels[level as keyof typeof GelfLogLevels] ?? GelfLogLevels.info
    );
  }
}
