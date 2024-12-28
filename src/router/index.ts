import { ServerResponse } from "node:http";

import { usersController, tracksController, artistsController, albumsController } from "../controllers";
import { httpMethod, httpStatus } from "../types/http";

import type { requestT } from "../middlewares";
import type { Controller } from "../types/abstractions";

const { GET, POST, PUT, DELETE } = httpMethod;
const { NOT_FOUND, NOT_ALLOWED } = httpStatus;

class AppRouter {
  controllers: { [k: string]: Controller } = {
    users: usersController,
    tracks: tracksController,
    artists: artistsController,
    albums: albumsController
  }
  
  processRequest (req: requestT, res: ServerResponse) {
    const { method, json, parsedUrl, uuid } = req;
    const { pathname } = parsedUrl!;
    const separatorIndex = pathname.indexOf("/", 1);
    const endpoint = ~separatorIndex ? pathname.slice(1) : pathname.slice(1, separatorIndex);
    const controller = this.controllers[endpoint];
    
    if (!controller) {
      res.writeHead(NOT_FOUND);
      res.end();
      return;
    }
    
    switch(method) {
      case POST: { controller.post(json, res); break; }
      case PUT: { controller.put(uuid, json, res); break; }
      case DELETE: { controller.delete(uuid, res); break; }
      case GET: { controller.get(uuid, res); break; }
      default: { 
        res.writeHead(NOT_ALLOWED); 
        res.end(); 
      };
    }
  }
}

export const appRouter = new AppRouter();