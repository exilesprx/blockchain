import EventEmitter from "events";
import express from 'express';
import Application from './app/index';

const application = new Application(express(), new EventEmitter);

application.init();

application.registerRoutes();

application.boot();