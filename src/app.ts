import express,  {Request, Response} from 'express';
import TransactionPool from './wallet/transaction-pool';
import { producer } from './stream/producer';
import Blockchain from './chain/blockchain';

const app = express();

const chain = new Blockchain(producer);

const pool = new TransactionPool(producer);

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