import { FindOptions } from "sequelize";
import { Conversation } from "./entity"
import { ConversationBody, ConversationDocument } from "./types";
import { HttpError } from "../../../utils/errors";

export const ConversationService = {
  async findAll() {
    return Conversation.findAll();
  },
  async findAndThrowError(query: FindOptions<ConversationDocument>) {
    const doc = await Conversation.findOne(query);
    if (!doc) throw new HttpError(404, "Conversation not found!");
    return doc;
  },
  async findOne(query: FindOptions<ConversationDocument>) {
    const doc = await Conversation.findOne(query);
    return doc;
  },
  async createConversation(body: ConversationBody) {
    // Rest of the logic
    return {};
  },
}