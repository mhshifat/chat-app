import Joi from "joi";
import { ConversationBody } from "./types";

export const CreateConversationValidationSchema = Joi.object<ConversationBody>({
  email: Joi.string().required(),
  message: Joi.string().required(),
  type: Joi.string().required(),
  name: Joi.string().optional(),
});
