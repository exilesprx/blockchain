import Application from "./main";

const application = new Application();
application.init();
application.registerEvents();
application.registerRoutes();
export default application.boot();
