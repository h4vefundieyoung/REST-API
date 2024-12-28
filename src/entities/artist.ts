import { Entity } from "../types/abstractions";

export class Artist extends Entity {
  name: string;
  grammy: boolean;

  constructor ({ name, grammy }: CreateArtistDTO) {
    super();
    this.name = name;
    this.grammy = grammy;
  }
};