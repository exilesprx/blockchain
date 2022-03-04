import Application from './main';
import env from 'dotenv';
import { logger } from "../logs/logger";

const configs = env.config();

logger.info(`Configs loaded: ${JSON.stringify(configs)}`);

const application = new Application();

application.init();

application.registerRoutes();

application.boot();