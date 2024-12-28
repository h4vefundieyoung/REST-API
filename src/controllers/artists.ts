import { ServerResponse } from "http";

import { Controller } from "../types/abstractions";
import { artistsService } from "../services";
import { isCreateArtistDTO, isUpdateArtistDTO } from "../types/typeguards";

class ArtistsController extends Controller<UpdateArtistDTO, CreateArtistDTO> {
  async get (id: string | null, res: ServerResponse) {
    try {
      const data = id ? await artistsService.getArtist(id) : await artistsService.getArtists();
      if (data) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(404);
        res.end();
      }
    } catch (e) {
      res.writeHead(500);
      res.end();
    }
  }

  async post (body: CreateArtistDTO, res: ServerResponse) {
    if (isCreateArtistDTO(body)) {
      try {
        await artistsService.createArtist(body);
        res.writeHead(201)
      } catch (e) {
        res.writeHead(500)
      }
      res.end();
    } else {
      res.writeHead(400);
      res.end();
    }
  }

  async put (id: string, body: UpdateArtistDTO, res: ServerResponse) {
    if(isUpdateArtistDTO(body)) {
      const userData = await artistsService.getArtist(id);
      if (!userData) {
        res.writeHead(404);
        return res.end();
      }
      await artistsService.updateArtist(id, body)
      res.writeHead(200);
      res.end();
    } else {
      res.writeHead(400)
      res.end();
    }
  }

  async delete (id: string, res: ServerResponse) {
    try {
      const isDeleted = await artistsService.deleteArtist(id);
      res.writeHead(isDeleted ? 204 : 404);
    } catch (e) {
      res.writeHead(500);
    }
    res.end();
  }
}

export const tracksController = new ArtistsController();