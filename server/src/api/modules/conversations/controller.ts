import { Request, Response, NextFunction } from "express";
import { ConversationService } from "./service";
import { ConversationBody } from "./types";
import { RequestResponse } from "../../../utils/response";
import { eventEmitter } from "../../../utils/events";

export const ConversationController = {
  async getConversations(req: Request<any, any, any>, res: Response, next: NextFunction) {
    const docs = await ConversationService.getAuthUserConversations(req.query, req.currentUser!);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(docs).success();
  },
  async createConversation(req: Request<any, any, ConversationBody>, res: Response, next: NextFunction) {
    const doc = await ConversationService.createPrivateConversation(req.body, req.currentUser!);
    eventEmitter.emit("onConversationCreate", doc);
    return RequestResponse.setResponse(res).setStatusCode(201).setData(doc).success();
  },
}