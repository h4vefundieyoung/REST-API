import { MiddlewareManager } from "./middlewareManager";

import type { middlewareT, requestT } from "./middlewareManager";

const parseBody: middlewareT = (req: requestT) => {
  const method = req.method?.toLowerCase();

  return new Promise((res, rej) => {
    let body = '';
    if(method === 'get' || method === 'head') {
      return res(null);
    }

    req
    .on('error', rej)
    .on('data', (chunk) => {
      body += chunk;
    })
    .on('end', () => {
      try {
        req.json = JSON.parse(body);
      } catch {}
      req.body = body ? body : undefined;
      res(null);
    });
  });
};

MiddlewareManager.use(parseBody);