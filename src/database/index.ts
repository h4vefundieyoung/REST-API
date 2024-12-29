import { User, Track, Artist, Album } from "../entities";

export const mockedDB: {
  users: User[]
  tracks: Track[]
  artists: Artist[]
  albums: Album[]
  favorites: {
    tracks: string[],
    albums: string[],
    artists: string[]
  }
} = {
  users: [],
  tracks: [],
  artists: [],
  albums: [],
  favorites: {
    tracks: [],
    albums: [],
    artists: []
  }
};