import { NextFunction, Request, Response } from "express";
import { RequestResponse } from './../../utils/response';

export async function requiresAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser) return RequestResponse.setResponse(res).setStatusCode(401).failure();
  return next();
}