export function isAlbumDTO(data: unknown): data is AlbumDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'year' in data &&
    'artistId' in data
  );
};