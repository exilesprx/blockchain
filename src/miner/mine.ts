import { consumer } from "../domain/stream/consumer";

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'transaction-added', fromBeginning: false })
    await consumer.run({
    
    eachMessage: async ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
        console.log(`- ${prefix} ${message.key}#${message.value}`)
    },
    });
    await consumer.disconnect();
}

run();