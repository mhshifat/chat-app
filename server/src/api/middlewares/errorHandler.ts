import { NextFunction, Request, Response } from 'express';
import { AppError } from "../../utils/errors";
import { RequestResponse } from "../../utils/response";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return RequestResponse.setResponse(res).setStatusCode(err.statusCode).setReason(err.message).failure();
  } else {
    return next(err);
  }
}