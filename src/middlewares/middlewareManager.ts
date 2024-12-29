import type { httpRequest } from "../types/http";

export type middlewareT = (req: httpRequest) => void | Promise<void>;
export type middlewareParamsT = Parameters<middlewareT>;

export class MiddlewareManager {
  private static middlewareList: middlewareT[] = [];

  static use (...args: middlewareT[]) {
    MiddlewareManager.middlewareList.push(...args);
  }

  static process (...args: middlewareParamsT) {
    return new Promise(async (res, rej) => {
      for (let middleware of MiddlewareManager.middlewareList) {
        try {
          await middleware(...args);
        } catch (e) {
          rej(e);
          break;
        }
      };
      res(args);
    })
  }
}