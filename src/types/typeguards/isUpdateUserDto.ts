export function isUpdateUserDTO(data: unknown): data is IUpdateUserDTO {
  return (
    typeof data === 'object' &&
    data !== null &&
    'oldPassword' in data &&
    'newPassword' in data
  );
}