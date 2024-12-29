import { mockedDB } from "../database";
import { Track } from "../entities";

class TracksService {
  async getTrack (id: string) {
    const track = mockedDB.tracks.find((track) => track.id === id);
    return track || null;
  }

  async getTracks () {
    return mockedDB.tracks;
  }

  async createTrack (trackData: CreateTrackDTO) {
    return mockedDB.tracks.push(new Track(trackData));
  }

  async updateTrack (id: string, data: UpdateTrackDTO) {
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
      mockedDB.favorites.tracks = mockedDB.favorites.tracks.filter((trackId) => trackId !== id);
      return Boolean(mockedDB.tracks.splice(index, 1));
    }
    return false;
  }
}

export const tracksService = new TracksService();