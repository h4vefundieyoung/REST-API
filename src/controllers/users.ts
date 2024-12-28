import { ServerResponse } from "http";

import { isCreateUserDTO, isUpdateUserDTO } from "../types/typeguards";
import { usersService } from "../services";
import { Controller } from "../types/abstractions";


class UsersController extends Controller<UpdateUserDTO, CreateUserDTO> {
  async get (id: string | null, res: ServerResponse) {
    try {
      const data = id ? await usersService.getUser(id) : await usersService.getUsers();

      if (data) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(404);
        res.end();
      }
    } catch (e) {
      res.writeHead(500);
      res.end();
    }
  }

  async post (body: CreateUserDTO, res: ServerResponse) {
    if (isCreateUserDTO(body)) {
      try {
        await usersService.createUser(body);
        res.writeHead(201)
      } catch (e) {
        res.writeHead(500)
      }
      res.end();
    } else {
      res.writeHead(400);
      res.end();
    }
  }

  async put (id: string, body: UpdateUserDTO, res: ServerResponse) {
    if(isUpdateUserDTO(body)) {
      const { oldPassword, newPassword } = body;
      const userData = await usersService.getUser(id);
      
      if (!userData) {
        res.writeHead(404);
        return res.end();
      }
      
      const isValidPass = await usersService.validateUserPassword(id, oldPassword);

      if (!isValidPass) {
        res.writeHead(403);
        return res.end();
      }
  
      await usersService.updateUserPassword(id, newPassword);
      res.writeHead(200);
      res.end();
    } else {
      res.writeHead(400)
      res.end();
    }
  }

  async delete (id: string, res: ServerResponse) {
    try {
      const isDeleted = await usersService.deleteUser(id);
      res.writeHead(isDeleted ? 204 : 404);
    } catch (e) {
      res.writeHead(500);
    }
    res.end();
  }
}

export const usersController = new UsersController();