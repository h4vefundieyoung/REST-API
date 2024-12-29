import { ServerResponse } from "node:http";

import type { httpRequest } from "../http"

export abstract class Controller {
  abstract get (req: httpRequest, res: ServerResponse): void
  abstract put (req: httpRequest, res: ServerResponse): void
  abstract delete (req: httpRequest, res: ServerResponse): void
  abstract post (req: httpRequest, res: ServerResponse): void
}