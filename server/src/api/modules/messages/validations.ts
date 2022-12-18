import Joi from "joi";
import { CreateMessageBody } from "./types";

export const CreateMessageValidationSchema = Joi.object<CreateMessageBody>({
  conversationId: Joi.string().required,
  message: Joi.string().required,
});
