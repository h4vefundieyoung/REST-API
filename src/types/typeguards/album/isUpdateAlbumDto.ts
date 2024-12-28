export function isUpdateAlbumDTO(data: unknown): data is UpdateAlbumDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'year' in data &&
    'artistId' in data
  );
};