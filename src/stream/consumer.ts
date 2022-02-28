import { kafka } from './kafka.js';

export const consumer = kafka.consumer({ groupId: `${process.env.KAFKA_GROUP_ID}` });