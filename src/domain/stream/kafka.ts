import { Kafka, logLevel } from 'kafkajs';
import Logger from '../logs/logger';

const logger: Logger = new Logger();

const toWinstonLogLevel = (level: any) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error';
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
      return 'debug';
    default:
      return 'info';
  }
};

const logCreator = (info: any) => {
  const {
    level, log,
  } = info;
  const { message, ...extra } = log;

  logger.log({
    level: toWinstonLogLevel(level),
    message,
    extra,
  });
};

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
  logCreator: () => logCreator,
});

export default kafka;
export { toWinstonLogLevel, logCreator };
