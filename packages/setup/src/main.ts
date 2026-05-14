import createTopics from './setup-kafka';

async function bootstrap(): Promise<void> {
  await createTopics();
}

bootstrap().catch((err) => {
  console.error('Error setting up Kafka topics:', err);
});
