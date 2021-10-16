import express from 'express';
import Application from './app/index';

const application = new Application(express());

application.init();

application.registerRoutes();

application.boot();