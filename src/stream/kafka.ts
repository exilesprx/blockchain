import { Kafka, logLevel } from 'kafkajs';
import { logger } from '../logs/logger';

export const toWinstonLogLevel = (level: any) => {
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
};

export const logCreater = () => {
  return ({ namespace, level, label, log }) => {
    const { message, ...extra } = log;

    logger.log({
        level: toWinstonLogLevel(level),
        message,
        extra,
    });
  };
};

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
  logCreator: logCreater
});