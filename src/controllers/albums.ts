import { ServerResponse } from "http";

import { Controller } from "../types/abstractions";
import { albumsService } from "../services";
import { isCreateAlbumDTO, isUpdateAlbumDTO } from "../types/typeguards";
import { httpStatus } from "../types/http/httpStatus";

const { OK, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, NO_CONTENT } = httpStatus;

class AlbumsController extends Controller<UpdateAlbumDTO, CreateAlbumDTO> {
  async get (id: string | null, res: ServerResponse) {
    try {
      const data = id ? await albumsService.getAlbum(id) : await albumsService.getAlbums();
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

  async post (body: CreateAlbumDTO, res: ServerResponse) {
    if (isCreateAlbumDTO(body)) {
      try {
        await albumsService.createAlbum(body);
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

  async put (id: string, body: UpdateAlbumDTO, res: ServerResponse) {
    if(isUpdateAlbumDTO(body)) {
      const userData = await albumsService.getAlbum(id);
      if (!userData) {
        res.writeHead(NOT_FOUND);
        return res.end();
      }
      await albumsService.updateAlbum(id, body)
      res.writeHead(OK);
      res.end();
    } else {
      res.writeHead(BAD_REQUEST)
      res.end();
    }
  }

  async delete (id: string, res: ServerResponse) {
    try {
      const isDeleted = await albumsService.deleteAlbum(id);
      res.writeHead(isDeleted ? NO_CONTENT : NOT_FOUND);
    } catch (e) {
      res.writeHead(INTERNAL_SERVER_ERROR);
    }
    res.end();
  }
}

export const albumsController = new AlbumsController();