export function isFavoritesDto (data: unknown): data is FavoritesDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'artists' in data &&
    'tracks' in data &&
    'albums' in data
  );
}