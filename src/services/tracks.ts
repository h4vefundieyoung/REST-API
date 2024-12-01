import { compare, hash } from "bcrypt";

import { mockedDB } from "../database";
import { Track } from "../entities";

class TracksService {
  async getTrack (id: string) {
    const track = mockedDB.tracks.find((track) => track.id === id);
    return track ? track : null;
  }

  async getTracks () {
    return mockedDB.tracks;
  }

  async createTrack (trackData: ICreateTrackDTO) {
    return mockedDB.tracks.push(new Track(trackData));
  }

  async updateTrack (id: string, data: IUpdateTrackDTO) {
    const track = mockedDB.tracks.find((track) => track.id === id);
    if (track) {
      Object.assign(track, data);
      return true
    }
    return false;
  };

  async deleteTrack (id: string) {
    const index = mockedDB.tracks.findIndex((track) => track.id === id);
    if (~index) {
      return Boolean(mockedDB.tracks.splice(index, 1));
    }
    return false;
  }
}

export const tracksService = new TracksService();