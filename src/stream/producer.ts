import { kafka } from'./kafka.js';

export const producer = kafka.producer()

// const run = async () => {
//     await producer.connect()
//     let i = 0;
//     setInterval(function() {
//         producer.send({
//             topic: 'test-topic',
//             messages: [
//               { key: 'test', value: 'Message # ' + i++ },
//             ],
//           });
//     }, 3000)
// }