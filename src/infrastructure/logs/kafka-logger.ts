import { logLevel } from "kafkajs";
import Logger from "./logger";

const LogLevelDescriptions: { [index in logLevel]: string } = {
  [logLevel.NOTHING]: "error",
  [logLevel.ERROR]: "error",
  [logLevel.WARN]: "warn",
  [logLevel.INFO]: "info",
  [logLevel.DEBUG]: "debug",
};

export default class KafkaLogger {
  private logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;
  }

  public static toWinstonLogLevel(level: any): string {
    return (
      LogLevelDescriptions[level as keyof typeof LogLevelDescriptions] || "info"
    );
  }

  public logCreator(info: any): void {
    const { level, log } = info;
    const { message, ...extra } = log;

    this.logger.log({
      level: KafkaLogger.toWinstonLogLevel(level),
      message,
      extra,
    });
  }
}
