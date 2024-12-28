export function isUpdateUserDTO(data: unknown): data is UpdateUserDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'oldPassword' in data &&
    'newPassword' in data
  );
}