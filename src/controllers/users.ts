import { ServerResponse } from "http";

import { isCreateUserDTO, isUpdateUserDTO } from "../types/typeguards";
import { usersService } from "../services";
import { Controller } from "../types/abstractions";
import { httpStatus } from "../types/http";

const { OK, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, NO_CONTENT } = httpStatus;

class UsersController extends Controller<UpdateUserDTO, CreateUserDTO> {
  async get (id: string | null, res: ServerResponse) {
    try {
      const data = id ? await usersService.getUser(id) : await usersService.getUsers();

      if (data) {
        res.writeHead(OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(NOT_FOUND);
        res.end();
      }
    } catch (e) {
      res.writeHead(INTERNAL_SERVER_ERROR);
      res.end();
    }
  }

  async post (body: CreateUserDTO, res: ServerResponse) {
    if (isCreateUserDTO(body)) {
      try {
        await usersService.createUser(body);
        res.writeHead(CREATED)
      } catch (e) {
        res.writeHead(INTERNAL_SERVER_ERROR)
      }
      res.end();
    } else {
      res.writeHead(BAD_REQUEST);
      res.end();
    }
  }

  async put (id: string, body: UpdateUserDTO, res: ServerResponse) {
    if(isUpdateUserDTO(body)) {
      const { oldPassword, newPassword } = body;
      const userData = await usersService.getUser(id);
      
      if (!userData) {
        res.writeHead(NOT_FOUND);
        return res.end();
      }
      
      const isValidPass = await usersService.validateUserPassword(id, oldPassword);

      if (!isValidPass) {
        res.writeHead(403);
        return res.end();
      }
  
      await usersService.updateUserPassword(id, newPassword);
      res.writeHead(OK);
      res.end();
    } else {
      res.writeHead(BAD_REQUEST)
      res.end();
    }
  }

  async delete (id: string, res: ServerResponse) {
    try {
      const isDeleted = await usersService.deleteUser(id);
      res.writeHead(isDeleted ? NO_CONTENT : NOT_FOUND);
    } catch (e) {
      res.writeHead(INTERNAL_SERVER_ERROR);
    }
    res.end();
  }
}

export const usersController = new UsersController();