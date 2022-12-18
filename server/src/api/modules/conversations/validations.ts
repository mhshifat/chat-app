import Joi from "joi";
import { ConversationBody } from "./types";

export const CreateConversationValidationSchema = Joi.object<ConversationBody>({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  message: Joi.string().required,
  type: Joi.string().required,
});
