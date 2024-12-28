declare interface UserDTO {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

declare interface UpdateUserDTO {
  oldPassword: string;
  newPassword: string;
}

declare interface CreateUserDTO {
  login: string;
  password: string;
}