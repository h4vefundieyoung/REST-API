export function isArtistDTO(data: unknown): data is ArtistDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'grammy' in data
  );
}