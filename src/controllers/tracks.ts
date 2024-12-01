import { ServerResponse } from "http";

import { Controller } from "../types/abstractions";
import { tracksService } from "../services";
import { isCreateTrackDTO, isUpdateTrackDTO } from "../types/typeguards";

class TracksController extends Controller<IUpdateTrackDTO, ICreateTrackDTO> {
  async get (id: string | null, res: ServerResponse) {
    try {
      const data = id ? await tracksService.getTrack(id) : await tracksService.getTracks();
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

  async post (body: ICreateTrackDTO, res: ServerResponse) {
    if (isCreateTrackDTO(body)) {
      try {
        await tracksService.createTrack(body);
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

  async put (id: string, body: IUpdateTrackDTO, res: ServerResponse) {
    if(isUpdateTrackDTO(body)) {
      const userData = await tracksService.getTrack(id);
      if (!userData) {
        res.writeHead(404);
        return res.end();
      }
      await tracksService.updateTrack(id, body)
      res.writeHead(200);
      res.end();
    } else {
      res.writeHead(400)
      res.end();
    }
  }

  async delete (id: string, res: ServerResponse) {
    try {
      const isDeleted = await tracksService.deleteTrack(id);
      res.writeHead(isDeleted ? 204 : 404);
    } catch (e) {
      res.writeHead(500);
    }
    res.end();
  }
}

export const tracksController = new TracksController();