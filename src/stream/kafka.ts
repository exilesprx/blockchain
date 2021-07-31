import { Kafka, logLevel } from 'kafkajs';
import { logger } from '../logs/logger';

const toWinstonLogLevel = (level: any) => {
    switch(level) {
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
}

export const kafka = new Kafka({
  clientId: 'blockchain',
  brokers: ['kafka1:19092'],
  logCreator: () => {
    return ({ namespace, level, label, log }) => {
      const { message, ...extra } = log
        logger.log({
            level: toWinstonLogLevel(level),
            message,
            extra,
        })
    }
  }
});