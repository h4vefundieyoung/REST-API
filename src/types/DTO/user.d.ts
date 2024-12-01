declare interface IUserDTO {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

declare interface IUpdateUserDTO {
  oldPassword: string;
  newPassword: string;
}

declare interface ICreateUserDTO {
  login: string;
  password: string;
}