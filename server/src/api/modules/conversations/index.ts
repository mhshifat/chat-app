import { Router } from "express";
import { ConversationController } from "./controller";
import { validateRequest } from "../../middlewares";
import { CreateConversationValidationSchema } from "./validations";

export const conversationRouter = Router();

conversationRouter.route("/")
  .get(ConversationController.getConversations)
  .post(
    [validateRequest(CreateConversationValidationSchema)],
    ConversationController.createConversation
  );
