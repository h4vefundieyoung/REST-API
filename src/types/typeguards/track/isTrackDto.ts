export function isTrackDTO(data: unknown): data is TrackDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'duration' in data &&
    'artistId' in data &&
    'albumId' in data
  );
}