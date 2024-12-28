import { compare, hash } from "bcrypt";

import { mockedDB } from "../database";

import { User } from "../entities";

class UsersService {
  async getUser (id: string) {
    const user = mockedDB.users.find((user) => user.id === id);

    if (user) {
      const cloned = { ...user } as Partial<User>;
      delete cloned.password;
      delete cloned.salt;
      return cloned
    }
    return null;
  }

  async getUsers () {
    return mockedDB.users.map((user) => {
      const cloned = { ...user } as Partial<User>;
      delete cloned.password;
      delete cloned.salt;
      return cloned;
    });
  }

  async createUser (userData: CreateUserDTO) {
    return mockedDB.users.push(new User(userData));
  }

  async updateUserPassword (id: string, password: string) {
    const user = mockedDB.users.find((user) => user.id === id);

    if (user) {
      const hashed = await hash(password, user.salt);
      user.password = hashed;
      user.updatedAt = Date.now().toString();
      user.version++;
      return true
    }

    return false;
  };

  async deleteUser (id: string) {
    const index = mockedDB.users.findIndex((user) => user.id === id);

    if (~index) {
      return Boolean(mockedDB.users.splice(index, 1));
    }

    return false;
  }

  async validateUserPassword (id: string, password: string) {
    const user = mockedDB.users.find((user) => user.id === id);

    if (!user) {
      return false;
    }

    return compare(password, user.password);
  }
}

export const usersService = new UsersService();