import { ServerResponse } from "http";

import { Controller } from "../types/abstractions";
import { artistsService } from "../services";
import { isCreateArtistDTO, isUpdateArtistDTO } from "../types/typeguards";
import { httpStatus } from "../types/http/httpStatus";

const { OK, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, NO_CONTENT } = httpStatus;

class ArtistsController extends Controller<UpdateArtistDTO, CreateArtistDTO> {
  async get (id: string | null, res: ServerResponse) {
    try {
      const data = id ? await artistsService.getArtist(id) : await artistsService.getArtists();
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

  async post (body: CreateArtistDTO, res: ServerResponse) {
    if (isCreateArtistDTO(body)) {
      try {
        await artistsService.createArtist(body);
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

  async put (id: string, body: UpdateArtistDTO, res: ServerResponse) {
    if(isUpdateArtistDTO(body)) {
      const userData = await artistsService.getArtist(id);
      if (!userData) {
        res.writeHead(NOT_FOUND);
        return res.end();
      }
      await artistsService.updateArtist(id, body)
      res.writeHead(OK);
      res.end();
    } else {
      res.writeHead(BAD_REQUEST)
      res.end();
    }
  }

  async delete (id: string, res: ServerResponse) {
    try {
      const isDeleted = await artistsService.deleteArtist(id);
      res.writeHead(isDeleted ? NO_CONTENT : NOT_FOUND);
    } catch (e) {
      res.writeHead(INTERNAL_SERVER_ERROR);
    }
    res.end();
  }
}

export const artistsController = new ArtistsController();