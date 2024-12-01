import { createServer } from "http";
import 'dotenv/config'

import { MiddlewareManager, requestT } from "./middlewares";
import { appRouter } from "./router";
import { CustomError } from "./types/abstractions";

const PORT = process.env.CLUSTER_PORT || process.env.APP_PORT || 4000;
const server = createServer(async (req, res) => {
    try {
        await MiddlewareManager.process(req as requestT);
        appRouter.processRequest(req as requestT, res);
    } catch (e) {
        if(e instanceof CustomError) {
            res.writeHead(e.status);
            res.end(e.toString());
        } else {
            res.writeHead(500);
            res.end();
        }
    }
}).listen(PORT);

console.log(`Server started on port ${PORT}`)