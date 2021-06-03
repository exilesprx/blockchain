import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'blockchain',
  brokers: ['kafka1:19092']
});