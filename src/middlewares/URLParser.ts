import type { middlewareT, requestT } from "./middlewareManager";

import { MiddlewareManager } from "./middlewareManager";

const parseURL: middlewareT = (req: requestT) => {
  req.parsedUrl = new URL(req.url || "", `http://${req.headers.host}`);
};

MiddlewareManager.use(parseURL);