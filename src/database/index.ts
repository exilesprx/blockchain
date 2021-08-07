import mongoose from 'mongoose';
import { logger } from '../logs/logger'

export default class Database
{
    private host: string;

    private port: number;

    private user: string;

    private secret: string;

    private authSource: string;

    constructor(host: string, port: number, user: string, secret: string, authSource: string = 'admin')
    {
        this.host = host;

        this.port = port;

        this.user = user;

        this.secret = secret;

        this.authSource = authSource;
    }

    public connect()
    {
        const connection = `mongodb://${this.user}:${this.secret}@${this.host}:${this.port}/blockchain`;
        
        mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true, authSource: this.authSource });

        mongoose.connection.on('error', err => {
            logger.error(`Connection Error: ${err}`);
        });
        
        mongoose.connection.once('open', () => {
            logger.info("Connection successful");
        });
    }
}