import { kafka } from './kafka.js';

const topic = 'test-topic'
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: false })
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`- ${prefix} ${message.key}#${message.value}`)
    },
  })
}