import { mockedDB } from "../database";
import { Artist } from "../entities";

class ArtistsService {
  async getArtist (id: string) {
    const artist = mockedDB.artists.find((artist) => artist.id === id);
    return artist || null;
  }

  async getArtists () {
    return mockedDB.artists;
  }

  async createArtist (artistData: CreateArtistDTO) {
    return mockedDB.artists.push(new Artist(artistData));
  }

  async updateArtist (id: string, data: UpdateArtistDTO) {
    const artist = mockedDB.artists.find((artist) => artist.id === id);
    if (artist) {
      Object.assign(artist, data);
      return true
    }
    return false;
  };

  async deleteArtist (id: string) {
    const index = mockedDB.artists.findIndex((artist) => artist.id === id);
    if (~index) {
      return Boolean(mockedDB.artists.splice(index, 1));
    }
    return false;
  }
}

export const artistsService = new ArtistsService();