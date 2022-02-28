import EventEmitter from "events";
import express from 'express';
import Application from './main';
import env from 'dotenv';
import { logger } from "../logs/logger";

const configs = env.config();

logger.info(`Configs loaded: ${JSON.stringify(configs)}`);

const application = new Application(express(), new EventEmitter());

application.init();

application.registerRoutes();

application.boot();