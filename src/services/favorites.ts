import { mockedDB } from "../database";

export type favoritesT = keyof typeof mockedDB.favorites;
export const collections = Object.keys(mockedDB.favorites);

class FavoritesService {
  async getFavorites () {
    return {
      tracks: mockedDB.favorites.tracks.map((favId) => mockedDB.tracks.find(({ id }) => id === favId)),
      artists: mockedDB.favorites.artists.map((favId) => mockedDB.artists.find(({ id }) => id === favId)),
      albums: mockedDB.favorites.albums.map((favId) => mockedDB.albums.find(({ id }) => id === favId))
    }
  }
  
  addFavorite(collection: favoritesT, uuid: string) {
    return Boolean(mockedDB.favorites[collection].push(uuid));
  }

  async removeFavorite(collection: favoritesT, uuid: string) {
    const index = mockedDB.favorites[collection].indexOf(uuid);
    if (~index) {
      return Boolean(mockedDB.favorites[collection].splice(index, 1));
    }
    return false;
  }
}

export const favoritesService = new FavoritesService();