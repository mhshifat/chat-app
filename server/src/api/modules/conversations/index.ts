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
