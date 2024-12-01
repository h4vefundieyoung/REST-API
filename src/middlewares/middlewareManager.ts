import { IncomingMessage } from "http";

export type requestT = { 
  body: string | null, 
  uuid: string | null, 
  parsedUrl: URL | null, 
  json: { [k: string]: any } | null
} & IncomingMessage;
export type middlewareT = (req: requestT) => void | Promise<void>;
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