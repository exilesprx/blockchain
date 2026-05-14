import { Kafka } from 'kafkajs';
import { env } from 'std-env';

const kafka = new Kafka({
  clientId: `${env.KAFKA_CLIENT_ID}`,
  brokers: [`${env.KAFKA_HOST}:${env.KAFKA_PORT}`]
});

const topics = [
  { topic: 'transaction-added', numPartitions: 1, replicationFactor: 1 },
  { topic: 'block-added', numPartitions: 1, replicationFactor: 1 }
]

const admin = kafka.admin();

async function createTopics(): Promise<void> {
  await admin.connect();

  try {
    await admin.createTopics({
      waitForLeaders: true,
      topics: topics
    });
    console.log('Topics created');
  } finally {
    await admin.disconnect();
  }
}

export default createTopics;
