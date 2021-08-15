import express,  {Request, Response} from 'express';
import TransactionPool from './wallet/transaction-pool';
import { producer } from './stream/producer';
import Blockchain from './chain/blockchain';
import { logger } from './logs/logger'
import Events from './events/emitter';
import Amount from './wallet/specifications/Amount';
import Receiver from './wallet/specifications/Receiver';
import Sender from './wallet/specifications/Sender';
import Database from './database/index';
import env from 'dotenv';
import EventEmitter from 'events';
import SameWallet from './wallet/specifications/SameWallet';

const configs = env.config();

const app = express();

app.use(express.json());

const emitter = new EventEmitter();

const events = Events.register(emitter, producer, logger);

const chain = new Blockchain(events);

const pool = new TransactionPool(events, chain);

const user: string = String(process.env.DB_USER);
const secret: string = String(process.env.DB_PASSWORD);
const host: string = String(process.env.DB_HOST);
const port: number = Number(process.env.DB_PORT);

const database = new Database(host, port, user, secret);

pool.addSpecification(new Amount())
    .addSpecification(new Receiver())
    .addSpecification(new Sender())
    .addSpecification(new SameWallet());

app.post('/transaction', (req: Request, res: Response) => {
    const params = req.body;

    try {
        // Create a new transaction, add it to the pool, and broadcast it
        const transaction = pool.fill(params.to, params.from, params.amount);

        return res.send(`Transaction ${transaction.getKey()} accepted.`);
    } catch(error) {
        res.sendStatus(401);
        return;
    }
});

app.listen(80, async () => {
    logger.info("App listening on port 80");

    logger.info(`Configs loaded: ${JSON.stringify(configs)}`);

    producer.connect();

    database.connect();

    await chain.restore();
});