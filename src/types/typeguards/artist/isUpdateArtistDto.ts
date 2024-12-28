export function isUpdateArtistDTO(data: unknown): data is UpdateArtistDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'grammy' in data
  );
}