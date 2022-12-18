import { Request, Response, NextFunction } from "express";
import { ConversationService } from "./service";
import { ConversationBody } from "./types";
import { RequestResponse } from "../../../utils/response";

export const ConversationController = {
  async createConversation(req: Request<any, any, ConversationBody>, res: Response, next: NextFunction) {
    const doc = await ConversationService.createConversation(req.body);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
}