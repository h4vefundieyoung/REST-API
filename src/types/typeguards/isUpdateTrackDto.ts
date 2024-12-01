export function isUpdateTrackDTO(data: unknown): data is IUpdateTrackDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'duration' in data &&
    'artistId' in data &&
    'albumId' in data
  );
}