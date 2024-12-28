import { genSaltSync, hashSync } from "bcrypt";

import { Entity } from "../types/abstractions/entity";

export class User extends Entity {
  salt = genSaltSync();
  version: 1;
  
  login: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  
  constructor ({ login, password }: CreateUserDTO) {
    super();
    const timestamp = Date.now().toString();

    this.login = login;
    this.password = hashSync(password, this.salt);
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }
};