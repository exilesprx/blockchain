import { Kafka } from 'kafkajs';
import { env } from 'std-env';
import Logger from '@blockchain/common/infrastructure/logs/logger';
import TransactionTopic from '@blockchain/common/infrastructure/stream/topic/transaction';
import BlockTopic from '@blockchain/common/infrastructure/stream/topic/block';

const kafka = new Kafka({
  clientId: `${env.KAFKA_CLIENT_ID}`,
  brokers: [`${env.KAFKA_HOST}:${env.KAFKA_PORT}`]
});

const topics = [
  {
    topic: new TransactionTopic().toString(),
    numPartitions: 1,
    replicationFactor: 1
  },
  { topic: new BlockTopic().toString(), numPartitions: 1, replicationFactor: 1 }
];

const admin = kafka.admin();

async function createTopics(logger: Logger): Promise<void> {
  await admin.connect();

  try {
    await admin.createTopics({
      waitForLeaders: true,
      topics: topics
    });
    logger.info('Topics created');
  } finally {
    await admin.disconnect();
  }
}

export default createTopics;
