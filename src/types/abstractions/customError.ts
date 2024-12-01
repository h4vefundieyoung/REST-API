export abstract class CustomError extends Error {
  status: number;
  
  toString() {
    return JSON.stringify(this);
  }
}