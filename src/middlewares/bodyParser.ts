import { MiddlewareManager } from "./middlewareManager";

import type { middlewareT, requestT } from "./middlewareManager";

const parseBody: middlewareT = (req: requestT) => {
  const method = req.method?.toLowerCase();

  return new Promise((res, rej) => {
    let body = '';
    if(method === 'get' || method === 'head') {
      return res();
    }

    req
    .on('error', rej)
    .on('data', (chunk) => {
      body += chunk;
    })
    .on('end', () => {
      try {
        req.json = JSON.parse(body);
      } catch {
        req.json = null;
      }
      req.body = body ? body : null;
      res();
    });
  });
};

MiddlewareManager.use(parseBody);