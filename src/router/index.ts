import { ServerResponse } from "node:http";

import { usersController, tracksController, artistsController, albumsController, favoritesController } from "../controllers";
import { httpMethod, httpStatus, httpRequest } from "../types/http";
import { mockedDB } from "../database";
import type { Controller } from "../types/abstractions";

const { GET, POST, PUT, DELETE } = httpMethod;
const { NOT_FOUND, NOT_ALLOWED } = httpStatus;

class AppRouter {
  controllers: { [k: string]: Controller } = {
    users: usersController,
    tracks: tracksController,
    artists: artistsController,
    albums: albumsController,
    favorites: favoritesController
  }
  
  processRequest (req: httpRequest, res: ServerResponse) {
    const { method, parsedUrl } = req;
    const { pathname } = parsedUrl;
    const separatorIndex = pathname.indexOf("/", 1);
    const endpoint = ~separatorIndex ? pathname.slice(1, separatorIndex) : pathname.slice(1);
    const controller = this.controllers[endpoint];

    if (!controller) {
      res.writeHead(NOT_FOUND);
      res.end();
      return;
    }
    
    switch(method) {
      case POST: { controller.post(req, res); break; }
      case PUT: { controller.put(req, res); break; }
      case DELETE: { controller.delete(req, res); break; }
      case GET: { controller.get(req, res); break; }
      default: { 
        res.writeHead(NOT_ALLOWED); 
        res.end(); 
      };
    }
  }
}

export const appRouter = new AppRouter();