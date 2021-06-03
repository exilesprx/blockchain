import express,  {Request, Response} from 'express';
import Transaction from './wallet/transaction';
import TransactionPool from './wallet/transaction-pool';
import { producer } from './stream/producer';
import Block from './chain/block';
import Blockchain from './chain/blockchain';

const app = express();

const chain = new Blockchain();

const pool = new TransactionPool();

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
    const transaction = new Transaction(params.to, params.from, params.amount);

    pool.addTransaction(transaction);

    producer.send({
        topic: 'transaction-test',
        messages: [
            { key: transaction.getKey(), value: JSON.stringify(transaction) },
        ],
    });

    // When the pool is filled, create a new block, and broadcast the block
    if (pool.isFilled()) {
        const block = new Block(pool.getTransactions(), chain.getLastBlockHash());

        producer.send({
            topic: 'block-test',
            messages: [
                { key: block.getKey(), value: JSON.stringify(block) },
            ]
        });
    }

    return res.send(`Transaction ${transaction.getKey()} accepted.}`);
});

app.listen(80, () => {
    console.log("App listening on port 80");
});