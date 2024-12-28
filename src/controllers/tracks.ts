import { ServerResponse } from "http";

import { Controller } from "../types/abstractions";
import { tracksService } from "../services";
import { isCreateTrackDTO, isUpdateTrackDTO } from "../types/typeguards";
import { httpStatus } from "../types/http";

const { OK, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, NO_CONTENT } = httpStatus;

class TracksController extends Controller<UpdateTrackDTO, CreateTrackDTO> {
  async get (id: string | null, res: ServerResponse) {
    try {
      const data = id ? await tracksService.getTrack(id) : await tracksService.getTracks();
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

  async post (body: CreateTrackDTO, res: ServerResponse) {
    if (isCreateTrackDTO(body)) {
      try {
        await tracksService.createTrack(body);
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

  async put (id: string, body: UpdateTrackDTO, res: ServerResponse) {
    if(isUpdateTrackDTO(body)) {
      const userData = await tracksService.getTrack(id);
      if (!userData) {
        res.writeHead(NOT_FOUND);
        return res.end();
      }
      await tracksService.updateTrack(id, body)
      res.writeHead(OK);
      res.end();
    } else {
      res.writeHead(BAD_REQUEST)
      res.end();
    }
  }

  async delete (id: string, res: ServerResponse) {
    try {
      const isDeleted = await tracksService.deleteTrack(id);
      res.writeHead(isDeleted ? NO_CONTENT : NOT_FOUND);
    } catch (e) {
      res.writeHead(INTERNAL_SERVER_ERROR);
    }
    res.end();
  }
}

export const tracksController = new TracksController();