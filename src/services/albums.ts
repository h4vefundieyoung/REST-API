import { mockedDB } from "../database";
import { Album } from "../entities";

class AlbumsService {
  async getAlbum (id: string) {
    const album = mockedDB.albums.find((album) => album.id === id);
    return album || null;
  }

  async getAlbums () {
    return mockedDB.albums;
  }

  async createAlbum (albumData: CreateAlbumDTO) {
    return mockedDB.albums.push(new Album(albumData));
  }

  async updateAlbum (id: string, data: UpdateAlbumDTO) {
    const album = mockedDB.albums.find((album) => album.id === id);
    if (album) {
      Object.assign(album, data);
      return true
    }
    return false;
  };

  async deleteAlbum (id: string) {
    const index = mockedDB.albums.findIndex((album) => album.id === id);
    if (~index) {
      return Boolean(mockedDB.albums.splice(index, 1));
    }
    return false;
  }
}

export const albumsService = new AlbumsService();