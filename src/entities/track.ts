import { Entity } from "../types/abstractions";

export class Track extends Entity {
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor ({ name, artistId, albumId, duration }: CreateTrackDTO) {
    super();
    this.name = name;
    this.artistId = artistId;
    this.albumId = albumId;
    this.duration = duration;
  }
};