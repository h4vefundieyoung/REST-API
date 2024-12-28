import { createServer } from "http";
import 'dotenv/config'

import { MiddlewareManager, requestT } from "./middlewares";
import { appRouter } from "./router";
import { CustomError } from "./types/abstractions";
import { httpStatus } from "./types/http";

const { INTERNAL_SERVER_ERROR } = httpStatus;

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
            res.writeHead(INTERNAL_SERVER_ERROR);
            res.end();
        }
    }
}).listen(PORT);

console.log(`Server started on port ${PORT}`)