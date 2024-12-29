import { IncomingMessage } from "node:http";

export type httpRequest = { 
  body: string | null, 
  uuid: string | null, 
  parsedUrl: URL, 
  json: { [k: string]: any } | null
} & IncomingMessage;