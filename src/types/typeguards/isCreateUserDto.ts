export function isCreateUserDTO(data: unknown): data is ICreateUserDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'login' in data &&
    'password' in data
  );
}