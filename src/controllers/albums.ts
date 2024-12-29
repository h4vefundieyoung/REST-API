import { ServerResponse } from "http";

import { Controller } from "../types/abstractions";
import { albumsService } from "../services";
import { isCreateAlbumDTO, isUpdateAlbumDTO } from "../types/typeguards";
import { httpStatus, httpRequest } from "../types/http";

const { OK, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, NO_CONTENT } = httpStatus;

class AlbumsController extends Controller {
  async get ({ uuid }: httpRequest, res: ServerResponse) {
    try {
      const data = uuid ? await albumsService.getAlbum(uuid) : await albumsService.getAlbums();
      if (data) {
        res.writeHead(OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(NOT_FOUND);
        res.end();
      }
    } catch (e) {
      res.writeHead(INTERNAL_SERVER_ERROR);
      res.end();
    }
  }

  async post ({ json }: httpRequest, res: ServerResponse) {
    if (isCreateAlbumDTO(json)) {
      try {
        await albumsService.createAlbum(json);
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

  async put ({ json, uuid }: httpRequest, res: ServerResponse) {
    if(isUpdateAlbumDTO(json) && uuid) {
      const userData = await albumsService.getAlbum(uuid);
      if (!userData) {
        res.writeHead(NOT_FOUND);
        return res.end();
      }
      await albumsService.updateAlbum(uuid, json)
      res.writeHead(OK);
      res.end();
    } else {
      res.writeHead(BAD_REQUEST)
      res.end();
    }
  }

  async delete ({ uuid }: httpRequest, res: ServerResponse) {
    if(uuid) {
      try {
        const isDeleted = await albumsService.deleteAlbum(uuid);
        res.writeHead(isDeleted ? NO_CONTENT : NOT_FOUND);
      } catch (e) {
        res.writeHead(INTERNAL_SERVER_ERROR);
      } 
    } else {
      res.writeHead(BAD_REQUEST);
    }
    res.end();
  }
}

export const albumsController = new AlbumsController();