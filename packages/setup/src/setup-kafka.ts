import { Kafka } from 'kafkajs';
import { env } from 'std-env';
import Logger from '@blockchain/common/infrastructure/logs/logger';
import TransactionTopic from '@blockchain/common/infrastructure/stream/topic/transaction';
import BlockTopic from '@blockchain/common/infrastructure/stream/topic/block';

const kafka = new Kafka({
  clientId: `${env.KAFKA_CLIENT_ID}`,
  brokers: [`${env.KAFKA_HOST}:${env.KAFKA_PORT}`]
});

const admin = kafka.admin();

async function createTopics(logger: Logger): Promise<void> {
  await admin.connect();

  try {
    const existing = await admin.listTopics();
    const topics = [
      new TransactionTopic().toString(),
      new BlockTopic().toString()
    ]
      .filter((t) => !existing.includes(t))
      .map((t) => ({ topic: t, numPartitions: 1, replicationFactor: 1 }));

    if (topics.length === 0) {
      logger.info('All Kafka topics already exist, no topics created.');
      return;
    }

    const created = await admin.createTopics({
      waitForLeaders: true,
      topics: topics
    });

    if (created) {
      logger.info(`Topics created: ${topics.map((t) => t.topic).join(',')}`);
    }
  } finally {
    await admin.disconnect();
  }
}

export default createTopics;
