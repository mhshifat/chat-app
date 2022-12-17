export abstract class AppError extends Error {
  abstract statusCode: number;
  abstract message: string;

  constructor(message: string) {
    super(message)
  }
}

export class ServerError extends AppError {
  constructor(public statusCode: number, public message: string) {
    super(message);

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class HttpError extends AppError {
  constructor(public statusCode: number, public message: string) {
    super(message);

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}