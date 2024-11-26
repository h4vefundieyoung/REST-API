import { IncomingMessage } from "http";

export type requestT = { body?: string, parsedUrl?: URL, json?: Object } & IncomingMessage;
export type middlewareT = (req: requestT) => void;
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
        }
      };
      res(args);
    })
  }
}