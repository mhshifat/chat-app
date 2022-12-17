import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { appConfig } from "../../config";
import { UserService } from "../modules/users/service";
import { JwtPayload } from "../modules/users/types";

export async function extractAuthUser(req: Request, res: Response, next: NextFunction) {
  const token = req.session?.token;
  if (!token) return next();
  
  try {
    const tokenPayload = jwt.verify(token, appConfig.jwtSecret) as JwtPayload;
    if (!tokenPayload) return next();
    const user = await UserService.findOne({ where: { id: tokenPayload.id } });
    if (!user) return next();
    req.currentUser = user.toJSON();
    return next();
  } catch (err) {
    return next();
  }
}