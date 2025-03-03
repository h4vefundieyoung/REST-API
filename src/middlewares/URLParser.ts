import { validate } from "uuid";

import type { httpRequest } from "../types/http";
import type { middlewareT } from "./middlewareManager";

import { MiddlewareManager } from "./middlewareManager";
import { InvalidUuidError } from "../errors";

const parseURL: middlewareT = async (req: httpRequest) => {
  const parsedUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const index = parsedUrl.pathname.lastIndexOf("/");
  const uuid = index ? parsedUrl.pathname.slice(index + 1) : null;
  if(uuid !== null) {
    const isUuid = validate(uuid);
    if(!isUuid) {
      return Promise.reject(new InvalidUuidError());
    }
  }
  
  req.uuid = uuid;
  req.parsedUrl = parsedUrl;
};

MiddlewareManager.use(parseURL);