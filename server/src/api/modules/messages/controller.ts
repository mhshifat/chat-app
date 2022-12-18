import { Request, Response, NextFunction } from "express";
import { MessageService } from "./service";
import { CreateMessageBody } from "./types";
import { RequestResponse } from "../../../utils/response";

export const MessageController = {
  async createMessage(req: Request<any, any, CreateMessageBody>, res: Response, next: NextFunction) {
    const doc = await MessageService.createMessage(req.body);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
}