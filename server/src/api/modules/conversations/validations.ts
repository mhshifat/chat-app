import Joi from "joi";
import { AddParticipentToConversation, ConversationBody } from "./types";

export const CreateConversationValidationSchema = Joi.object<ConversationBody>({
  email: Joi.string().required(),
  message: Joi.string().required(),
  type: Joi.string().required(),
  name: Joi.string().optional(),
});

export const AddConversationParticipent = Joi.object<AddParticipentToConversation>({
  conversationId: Joi.string().required(),
  participentId: Joi.string().required(),
});

export const RemoveConversationParticipent = Joi.object<AddParticipentToConversation>({
  conversationId: Joi.string().required(),
});
