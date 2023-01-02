import { Router } from "express";
import { MessageController } from "./controller";
import { validateRequest, requiresAuth } from "../../middlewares";
import { CreateMessageValidationSchema } from "./validations";

export const messageRouter = Router();

messageRouter.use(requiresAuth);

messageRouter.route("/")
  .get(MessageController.getConversationMessages)
  .post(
    [validateRequest(CreateMessageValidationSchema)],
    MessageController.createMessage
  );
