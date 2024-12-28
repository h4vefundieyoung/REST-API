export function isCreateArtistDTO(data: unknown): data is CreateArtistDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'grammy' in data
  );
}