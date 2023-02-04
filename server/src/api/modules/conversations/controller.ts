import { Request, Response, NextFunction } from "express";
import { ConversationService } from "./service";
import { AddParticipentToConversation, ConversationBody } from "./types";
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
  async addParticipentToConversation(req: Request<any, any, AddParticipentToConversation>, res: Response, next: NextFunction) {
    const doc = await ConversationService.addParticipentToConversation(req.body, req.currentUser!);
    eventEmitter.emit("onParticipentAddToConversationCreate", doc);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
  async removeParticipentToConversation(req: Request<{ id: string }, any, { conversationId: string }>, res: Response, next: NextFunction) {
    const doc = await ConversationService.removeParticipentToConversation({
      conversationId: req.body.conversationId,
      participentId: req.params.id
    }, req.currentUser!);
    eventEmitter.emit("onParticipentAddToConversationCreate", doc);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
  async banParticipentToConversation(req: Request<{ id: string }, any, { conversationId: string }>, res: Response, next: NextFunction) {
    const doc = await ConversationService.banParticipentToConversation({
      conversationId: req.body.conversationId,
      participentId: req.params.id
    }, req.currentUser!);
    eventEmitter.emit("onParticipentAddToConversationCreate", doc);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
  async unbanParticipentToConversation(req: Request<{ id: string }, any, { conversationId: string }>, res: Response, next: NextFunction) {
    const doc = await ConversationService.unbanParticipentToConversation({
      conversationId: req.body.conversationId,
      participentId: req.params.id
    }, req.currentUser!);
    eventEmitter.emit("onParticipentAddToConversationCreate", doc);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
  async muteParticipentToConversation(req: Request<{ id: string }, any, { conversationId: string }>, res: Response, next: NextFunction) {
    const doc = await ConversationService.muteParticipentToConversation({
      conversationId: req.body.conversationId,
      participentId: req.params.id
    }, req.currentUser!);
    eventEmitter.emit("onParticipentAddToConversationCreate", doc);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
  async unmuteParticipentToConversation(req: Request<{ id: string }, any, { conversationId: string }>, res: Response, next: NextFunction) {
    const doc = await ConversationService.unmuteParticipentToConversation({
      conversationId: req.body.conversationId,
      participentId: req.params.id
    }, req.currentUser!);
    eventEmitter.emit("onParticipentAddToConversationCreate", doc);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
  async transferOwnership(req: Request<{ id: string }, any, { conversationId: string }>, res: Response, next: NextFunction) {
    const doc = await ConversationService.transferOwnership({
      conversationId: req.body.conversationId,
      participentId: req.params.id
    }, req.currentUser!);
    eventEmitter.emit("onTransferConversation", doc);
    return RequestResponse.setResponse(res).setStatusCode(200).setData(doc).success();
  },
}