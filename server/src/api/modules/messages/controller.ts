import { Request, Response, NextFunction } from "express";
import { MessageService } from "./service";
import { CreateMessageBody, GetConversationMessagesParams, UpdateMessageBody } from "./types";
import { RequestResponse } from "../../../utils/response";

export const MessageController = {
  async getConversationMessages(req: Request<any, any, any, GetConversationMessagesParams>, res: Response, next: NextFunction) {
    const docs = await MessageService.getConversationMessages(req.query.conversationId, req.currentUser!);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(docs).success();
  },
  async createMessage(req: Request<any, any, CreateMessageBody>, res: Response, next: NextFunction) {
    const doc = await MessageService.createMessage({
      conversationId: req.body.conversationId,
      message: req.body.message,
      writter: req.currentUser
    });
    return RequestResponse.setResponse(res).setStatusCode(201).setData(doc).success();
  },
  async updateMessage(req: Request<{ id: string }, any, UpdateMessageBody>, res: Response, next: NextFunction) {
    const doc = await MessageService.updateMessage(req.params.id, req.body, req.currentUser!);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
  async deleteMessage(req: Request<{ id: string }, any, any>, res: Response, next: NextFunction) {
    const doc = await MessageService.deleteMessage(req.params.id, req.currentUser!);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
}