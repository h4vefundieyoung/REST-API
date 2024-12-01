import { CustomError } from "../types/abstractions";

export class InvalidUuidError extends CustomError {
  constructor() {
    super();
    this.status = 400;
    this.message = "Invalid uuid";
  }
}