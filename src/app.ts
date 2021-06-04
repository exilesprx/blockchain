import express,  {Request, Response} from 'express';
import TransactionPool from './wallet/transaction-pool';
import { producer } from './stream/producer';
import Blockchain from './chain/blockchain';
import Topic from './stream/topic/topic';

const app = express();

const chain = new Blockchain(producer, Topic.new('block-test'));

const pool = new TransactionPool(producer, Topic.new('transaction-test'));

app.use(express.json());

producer.connect();

app.use('/transaction', (req: Request, res: Response, next: any) => {

    if (!req.body.to || !req.body.from || !req.body.amount) {
        res.sendStatus(401);
    }

    next();
    return;
});

app.post('/transaction', (req: Request, res: Response) => {
    const params = req.body;

    // Create a new transaction, add it to the pool, and broadcast it
    const transaction = pool.addTransaction(params.to, params.from, params.amount);

    // When the pool is filled, create a new block, and broadcast the block
    if (pool.isFilled()) {
        chain.addBlock(pool.getTransactions());
    }

    return res.send(`Transaction ${transaction.getKey()} accepted.}`);
});

app.listen(80, () => {
    console.log("App listening on port 80");
});