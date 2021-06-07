import express,  {Request, Response} from 'express';
import TransactionPool from './wallet/transaction-pool';
import { producer } from './stream/producer';
import Blockchain from './chain/blockchain';
import { consumer } from './stream/consumer';
import { logger } from './logs/logger'
import Events from './events/emitter';
import Amount from './wallet/specifications/Amount';
import Receiver from './wallet/specifications/Receiver';
import Sender from './wallet/specifications/Sender';

const app = express();

app.use(express.json());

const events = Events.register(producer, logger);

const chain = new Blockchain(events);

// chain.restore(consumer);

const pool = new TransactionPool(events, chain);

pool.addSpecification(new Amount())
    .addSpecification(new Receiver())
    .addSpecification(new Sender());

producer.connect();

app.post('/transaction', (req: Request, res: Response) => {
    const params = req.body;

    try {
        // Create a new transaction, add it to the pool, and broadcast it
        const transaction = pool.addTransaction(params.to, params.from, params.amount);

        return res.send(`Transaction ${transaction.getKey()} accepted.`);
    } catch(error) {
        res.sendStatus(401);
        return;
    }
});

app.listen(80, () => {
    logger.info("App listening on port 80");
});