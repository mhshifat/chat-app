import { Router } from "express";
import { MessageController } from "./controller";
import { validateRequest } from "../../middlewares";
import { CreateMessageValidationSchema } from "./validations";

export const messageRouter = Router();

messageRouter.route("/login")
.post(
  [validateRequest(CreateMessageValidationSchema)],
  MessageController.createMessage
);
