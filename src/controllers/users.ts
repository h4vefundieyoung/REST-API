import { ServerResponse } from "http";

import { isCreateUserDTO, isUpdateUserDTO } from "../types/typeguards";
import { usersService } from "../services";
import { Controller } from "../types/abstractions";
import { httpStatus, httpRequest } from "../types/http";

const { OK, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, NO_CONTENT } = httpStatus;

class UsersController extends Controller {
  async get ({ uuid }: httpRequest, res: ServerResponse) {
    try {
      const data = uuid ? await usersService.getUser(uuid) : await usersService.getUsers();
      
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

  async post ({ json }: httpRequest , res: ServerResponse) {
    if (isCreateUserDTO(json)) {
      try {
        await usersService.createUser(json);
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

  async put ({ json, uuid }: httpRequest, res: ServerResponse) {
    if(isUpdateUserDTO(json) && uuid) {
      const { oldPassword, newPassword } = json;
      const userData = await usersService.getUser(uuid);
      
      if (!userData) {
        res.writeHead(NOT_FOUND);
        return res.end();
      }
      
      const isValidPass = await usersService.validateUserPassword(uuid, oldPassword);

      if (!isValidPass) {
        res.writeHead(403);
        return res.end();
      }
  
      await usersService.updateUserPassword(uuid, newPassword);
      res.writeHead(OK);
      res.end();
    } else {
      res.writeHead(BAD_REQUEST)
      res.end();
    }
  }

  async delete ({ uuid }: httpRequest, res: ServerResponse) {
    if(uuid){
      try {
        const isDeleted = await usersService.deleteUser(uuid);
        res.writeHead(isDeleted ? NO_CONTENT : NOT_FOUND);
      } catch (e) {
        res.writeHead(INTERNAL_SERVER_ERROR);
      }
    } else {
      res.writeHead(BAD_REQUEST);
    }
    res.end();
  }
}

export const usersController = new UsersController();