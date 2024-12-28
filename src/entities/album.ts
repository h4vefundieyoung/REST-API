import { Entity } from "../types/abstractions";

export class Album extends Entity {
  name: string;
  year: number;
  artistId: string | null;

  constructor ({ name, year, artistId }: CreateAlbumDTO) {
    super();
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
};