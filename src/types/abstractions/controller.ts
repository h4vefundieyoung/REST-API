import { ServerResponse } from 'node:http';

export abstract class Controller<U = unknown, C = unknown> {
  abstract get (id: string | null, res: ServerResponse): void
  abstract put (id: string | null, body: U, res: ServerResponse): void
  abstract delete (id: string | null, res: ServerResponse): void
  abstract post (body: C, res: ServerResponse): void
}