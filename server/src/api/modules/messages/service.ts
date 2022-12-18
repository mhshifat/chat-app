import { FindOptions } from "sequelize";
import { Message } from "./entity"
import { MessageDocument, CreateMessageBody } from "./types";
import { HttpError } from "../../../utils/errors";

export const MessageService = {
  async findAll() {
    return Message.findAll();
  },
  async findAndThrowError(query: FindOptions<MessageDocument>) {
    const doc = await Message.findOne(query);
    if (!doc) throw new HttpError(404, "Message not found!");
    return doc;
  },
  async findOne(query: FindOptions<MessageDocument>) {
    const doc = await Message.findOne(query);
    return doc;
  },
  async createMessage(body: CreateMessageBody) {
    // Logic
    return {}
  }
}