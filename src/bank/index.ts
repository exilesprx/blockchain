import TransactionPool from "../wallet/transaction-pool"
import Events from "../events/emitter";
import Blockchain from "../chain/blockchain";
import Transaction from "../wallet/transaction";
import Block from "../chain/block";
import TransactionEvent from "../models/transaction";
import { jsonEvent } from "@eventstore/db-client";

export default class Bank
{
    private transactions: TransactionPool;
    
    private blockchain: Blockchain;

    private events: Events;

    public constructor(transactions: TransactionPool, blockchain: Blockchain, events: Events)
    {
        this.transactions = transactions;

        this.blockchain = blockchain;

        this.events = events;
    }

    public addTransaction(transaction: Transaction) : void
    {
        this.transactions.fill(transaction)

        const event = jsonEvent<TransactionEvent>({
            type: "transaction",
            data: {
                id: transaction.getKey(),
                to: transaction.getReceiver(),
                from: transaction.getSender(),
                amount: transaction.getAmount(),
                date: transaction.getDate(),
                hash: transaction.getHash()
            },
        });

        this.events.emit('transaction-added', event);
    }

    public addBlock(block: Block) : void
    {
        this.blockchain.addBlock(block);

        this.events.emit('block-added', block);
    }
}