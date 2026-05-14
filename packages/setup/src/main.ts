import createTopics from './setup-kafka';
import Logger from '@blockchain/common/infrastructure/logs/logger';
import Console from '@blockchain/common/infrastructure/logs/transports/console';

const logger = new Logger([new Console()]);

async function bootstrap(): Promise<void> {
  await createTopics(logger);
}

bootstrap().catch((err) => {
  logger.error(`Error setting up Kafka topics: ${err}`);
});
