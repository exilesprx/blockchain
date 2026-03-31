import { createServer } from 'node:http';
import { toNodeListener } from 'h3';
import application from '@/index';
import { env } from 'std-env';

application.then((app) => {
  createServer(toNodeListener(app)).listen(env.APP_PORT || 3000);
});
