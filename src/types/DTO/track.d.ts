declare interface TrackDTO {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

declare interface CreateTrackDTO extends Omit<TrackDTO, "id"> {}
declare interface UpdateTrackDTO extends CreateTrackDTO {}
