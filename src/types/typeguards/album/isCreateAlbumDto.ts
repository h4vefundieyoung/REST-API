export function isCreateAlbumDTO(data: unknown): data is CreateAlbumDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'year' in data &&
    'artistId' in data
  );
};