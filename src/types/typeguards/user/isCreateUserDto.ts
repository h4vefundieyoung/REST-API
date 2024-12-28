export function isCreateUserDTO(data: unknown): data is CreateUserDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'login' in data &&
    'password' in data
  );
}