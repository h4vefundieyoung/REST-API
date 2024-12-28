interface AlbumDTO {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

interface CreateAlbumDTO extends Omit<AlbumDTO, "id"> {}
interface UpdateAlbumDTO extends AlbumDTO {}
