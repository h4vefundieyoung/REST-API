import { ServerResponse } from "node:http";

import { usersController, tracksController } from "../controllers";
import { httpMethods } from "../types/httpMethods";

import type { requestT } from "../middlewares";
import type { Controller } from "../types/abstractions";

const { GET, POST, PUT, DELETE } = httpMethods;

class AppRouter {
  controllers: { [k: string]: Controller } = {
    users: usersController,
    tracks: tracksController
  }
  
  processRequest (req: requestT, res: ServerResponse) {
    const { method, json, parsedUrl, uuid } = req;
    const { pathname } = parsedUrl!;
    const separatorIndex = pathname.indexOf("/", 1);
    const endpoint = pathname.slice(1, ~separatorIndex ? separatorIndex : undefined);
    const controller = this.controllers[endpoint];
    
    if (!controller) {
      res.writeHead(404);
      res.end();
      return;
    }
    
    switch(method) {
      case POST: { controller.post(json, res); break; }
      case PUT: { controller.put(uuid, json, res); break; }
      case DELETE: { controller.delete(uuid, res); break; }
      case GET: { controller.get(uuid, res); break; }
      default: { 
        res.writeHead(405); 
        res.end(); 
      };
    }
  }
}

export const appRouter = new AppRouter();