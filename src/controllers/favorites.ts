import { ServerResponse } from "http";

import { Controller } from "../types/abstractions";
import { favoritesService, tracksService, albumsService, artistsService } from "../services";
import { httpStatus, httpRequest } from "../types/http";
import { isFavoritesCollectionKey } from "../types/typeguards";

const { OK, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, NO_CONTENT, UNPROCESSABLE_ENTITY, NOT_IMPLEMENTED } = httpStatus;

class FavoritesController extends Controller {
  services = {
    tracks: { getEntity: tracksService.getTrack },
    albums: { getEntity: albumsService.getAlbum },
    artists: { getEntity: artistsService.getArtist }
  }

  async get (req: httpRequest, res: ServerResponse) {
    try {
      const data = await favoritesService.getFavorites();
      if (data) {
        res.writeHead(OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      }
    } catch (e) {
      res.writeHead(INTERNAL_SERVER_ERROR);
      res.end();
    }
  }

  async post ({ parsedUrl, uuid }: httpRequest, res: ServerResponse) {
    const collection = this.parseCollection(parsedUrl.pathname);

    if (isFavoritesCollectionKey(collection) && uuid) {
      try {
        const uuidExists = await this.services[collection].getEntity(uuid);
        if (!uuidExists) {
          res.writeHead(UNPROCESSABLE_ENTITY)
          res.end();
        }
        await favoritesService.addFavorite(collection, uuid);
        res.writeHead(CREATED)
      } catch (e) {
        res.writeHead(INTERNAL_SERVER_ERROR)
      }
      res.end();
    } else {
      res.writeHead(BAD_REQUEST);
      res.end();
    }
  }

  async delete ({ parsedUrl, uuid }: httpRequest, res: ServerResponse) {
    const collection = this.parseCollection(parsedUrl.pathname);

    if(isFavoritesCollectionKey(collection) && uuid) {
      try {
        const isDeleted = await favoritesService.removeFavorite(collection, uuid);
        res.writeHead(isDeleted ? NO_CONTENT : NOT_FOUND);
      } catch (e) {
        res.writeHead(INTERNAL_SERVER_ERROR);
      }
    } else {
      res.writeHead(BAD_REQUEST);
    }
    res.end();
  }

  async put (req: httpRequest, res: ServerResponse) { 
    res.writeHead(NOT_IMPLEMENTED);
    res.end();
  }

  parseCollection (pathname: string) {
    const firstSeparator = pathname.indexOf("/", 1);
    const secondSeparator = pathname.indexOf("/", firstSeparator + 1);
    return pathname.slice(firstSeparator + 1, secondSeparator);
  }
}

export const favoritesController = new FavoritesController();