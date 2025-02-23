import { createServer } from "node:http";
import { toNodeListener } from "h3";
import application from "./index";

application.then((app) => {
  createServer(toNodeListener(app)).listen(process.env.APP_PORT || 3000);
});
