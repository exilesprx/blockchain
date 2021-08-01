import mongoose from 'mongoose';
import { logger } from '../logs/logger'

export default class Database
{
    private host: string;

    private port: number;

    private user: string;

    private secret: string;

    constructor(host: string, port: number, user: string, secret: string)
    {
        this.host = host;

        this.port = port;

        this.user = user;

        this.secret = secret;
    }

    public connect()
    {
        const connection = `mongodb://${this.user}:${this.secret}@${this.host}:${this.port}`;
        
        mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true});

        mongoose.connection.on('error', err => {
            logger.error(`Connection Error: ${err}`);
        });
        
        mongoose.connection.once('open', () => {
            logger.info("Connection successful");
        });
    }
}