import Application from './main';
import env from 'dotenv';
import { logger } from "../logs/logger";

logger.info(`Configs loaded: ${JSON.stringify(process.env)}`);

const application = new Application();

application.init();

application.registerRoutes();

application.boot();