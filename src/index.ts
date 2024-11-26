import { createServer } from "http";

import { MiddlewareManager } from "./middlewares";

const server = createServer((req, res) => {
    MiddlewareManager.process(req);
});