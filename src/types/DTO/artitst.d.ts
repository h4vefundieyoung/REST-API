declare interface ArtistDTO {
  id: string;
  name: string;
  grammy: boolean;
}

declare interface CreateArtistDTO extends Omit<ArtistDTO, "id"> {}
declare interface UpdateArtistDTO extends CreateTrackDTO {}
