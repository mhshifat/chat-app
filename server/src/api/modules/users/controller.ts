import { Request, Response, NextFunction } from "express";
import { UserService } from "./service";
import { LoginBody, RegisterBody } from "./types";
import { RequestResponse } from "../../../utils/response";

export const UserController = {
  async getMe(req: Request, res: Response, next: NextFunction) {
    return RequestResponse.setResponse(res).setStatusCode(200).setData(req.currentUser).success();
  },
  async getAll(req: Request, res: Response, next: NextFunction) {
    const docs = await UserService.findAll();
    return RequestResponse.setResponse(res).setStatusCode(200).setData(docs).success();
  },
  async register(req: Request<any, any, RegisterBody>, res: Response, next: NextFunction) {
    const { token, user } = await UserService.registerUser(req.body);
    req.session = { token };
    return RequestResponse.setResponse(res).setStatusCode(200).setData(user).success();
  },
  async login(req: Request<any, any, LoginBody>, res: Response, next: NextFunction) {
    const { token, user } = await UserService.loginUser(req.body);
    req.session = { token };
    return RequestResponse.setResponse(res).setStatusCode(200).setData(user).success();
  },
}