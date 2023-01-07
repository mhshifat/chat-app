import Joi from "joi";
import { CreateMessageBody, UpdateMessageBody } from "./types";

export const CreateMessageValidationSchema = Joi.object<CreateMessageBody>({
  conversationId: Joi.string().required(),
  message: Joi.string().required(),
});

export const UpdateMessageValidationSchema = Joi.object<UpdateMessageBody>({
  message: Joi.string().required(),
});
