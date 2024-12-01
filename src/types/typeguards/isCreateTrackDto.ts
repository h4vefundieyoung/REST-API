export function isCreateTrackDTO(data: unknown): data is ICreateTrackDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'duration' in data &&
    'artistId' in data &&
    'albumId' in data
  );
}