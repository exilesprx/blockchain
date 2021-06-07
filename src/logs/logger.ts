import winston from 'winston';

export const logger = winston.createLogger({
    format: winston.format.cli({ colors: { info: 'yellow' , error: 'red' }}),
    transports: [
        new winston.transports.Console()
    ]
});