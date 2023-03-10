import { Router } from "express";
import { ConversationController } from "./controller";
import { validateRequest } from "../../middlewares";
import { AddConversationParticipent, CreateConversationValidationSchema, RemoveConversationParticipent } from "./validations";

export const conversationRouter = Router();

conversationRouter.route("/")
  .get(ConversationController.getConversations)
  .post(
    [validateRequest(CreateConversationValidationSchema)],
    ConversationController.createConversation
  );

conversationRouter.route("/participents")
  .post(
    [validateRequest(AddConversationParticipent)],
    ConversationController.addParticipentToConversation
  );

conversationRouter.route("/participents/:id")
  .post(
    [validateRequest(RemoveConversationParticipent)],
    ConversationController.removeParticipentToConversation
  );

conversationRouter.route("/participents/:id/ban")
  .post(
    [validateRequest(RemoveConversationParticipent)],
    ConversationController.banParticipentToConversation
  );

conversationRouter.route("/participents/:id/unban")
  .post(
    [validateRequest(RemoveConversationParticipent)],
    ConversationController.unbanParticipentToConversation
  );

conversationRouter.route("/participents/:id/mute")
  .post(
    [validateRequest(RemoveConversationParticipent)],
    ConversationController.muteParticipentToConversation
  );

conversationRouter.route("/participents/:id/unmute")
  .post(
    [validateRequest(RemoveConversationParticipent)],
    ConversationController.unmuteParticipentToConversation
  );

conversationRouter.route("/participents/:id/transfer-ownership")
  .post(
    [validateRequest(RemoveConversationParticipent)],
    ConversationController.transferOwnership
  );
