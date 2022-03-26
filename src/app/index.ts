import Application from './main';
import logger from '../domain/logs/logger';

logger.info(`Configs loaded: ${JSON.stringify(process.env)}`);

const application = new Application();

application.init();

application.registerRoutes();

application.boot();
