declare interface ITrackDTO {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

declare interface ICreateTrackDTO extends Omit<ITrackDTO, "id"> {}
declare interface IUpdateTrackDTO extends ICreateTrackDTO {}
