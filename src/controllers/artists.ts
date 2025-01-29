import { ServerResponse } from "http";

import { Controller } from "../types/abstractions";
import { artistsService } from "../services";
import { isCreateArtistDTO, isUpdateArtistDTO } from "../types/typeguards";
import { httpStatus, httpRequest } from "../types/http";

const { OK, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, NO_CONTENT } = httpStatus;

class ArtistsController extends Controller {
  async get ({ uuid }: httpRequest, res: ServerResponse) {
    try {
      const data = uuid ? await artistsService.getArtist(uuid) : await artistsService.getArtists();
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
    if (isCreateArtistDTO(json)) {
      try {
        await artistsService.createArtist(json);
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

  async put ({ uuid, json }: httpRequest, res: ServerResponse) {
    if(isUpdateArtistDTO(json) && uuid) {
      const userData = await artistsService.getArtist(uuid);
      if (!userData) {
        res.writeHead(NOT_FOUND);
        return res.end();
      }
      await artistsService.updateArtist(uuid, json)
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
        const isDeleted = await artistsService.deleteArtist(uuid);
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

export const artistsController = new ArtistsController();