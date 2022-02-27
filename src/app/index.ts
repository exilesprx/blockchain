import EventEmitter from "events";
import express, { Express } from "express";
import Blockchain from "../chain/blockchain";
import Events from "../events/emitter";
import { logger } from "../logs/logger";
import { producer } from "../stream/producer";
import Amount from "../wallet/specifications/amount";
import Receiver from "../wallet/specifications/receiver";
import SameWallet from "../wallet/specifications/same-wallet";
import Sender from "../wallet/specifications/sender";
import TransactionPool from "../wallet/transaction-pool";
import { default as TransactionRoute } from "./routes/transaction";
import Database from "../database";
import Bank from "../bank";
import Block from "../chain/block";

export default class Application
{
    private app: Express;

    private emitter: EventEmitter;

    private events: Events;

    private chain: Blockchain;

    private pool: TransactionPool;

    private bank: Bank;

    private database: Database;

    constructor(app: Express, emitter: EventEmitter)
    {
        this.app = app;

        this.emitter = emitter;

        this.events = Events.register(this.emitter, producer, logger);

        this.chain = new Blockchain();

        this.pool = new TransactionPool();

        this.bank = new Bank(this.pool, this.chain, this.events);

        this.database = new Database(String(process.env.DB_HOST), Number(process.env.DB_PORT), String(process.env.DB_USER), String(process.env.DB_PASSWORD));
    }

    public init()
    {
        this.app.use(express.json());

        this.pool.addSpecification(new Amount())
            .addSpecification(new Receiver())
            .addSpecification(new Sender())
            .addSpecification(new SameWallet());
    }

    public async boot()
    {
        // this.database.connect();

        producer.connect();

        // TODO: restore from eventstore

        // TODO: consumer from block mined consumer
        // this.bank.addBlock(new Block());

        this.app.listen(process.env.APP_PORT, () => {
            logger.info(`App listening on port ${process.env.APP_PORT}`);
        });
    }

    public registerRoutes()
    {
        this.app.post(TransactionRoute.getName(), TransactionRoute.getAction(this.bank));
    }
}