import { v4 } from "uuid"

export abstract class Entity {
  id = v4();
}