import { FindOptionsWhere } from "typeorm";
import { Message } from "./entity"
import { MessageDocument, CreateMessageBody } from "./types";
import { HttpError } from "../../../utils/errors";
import { ConversationService } from "../conversations/service";
import { UserDocument } from "../users/types";

export const MessageService = {
  async findAll() {
    return Message.find();
  },
  async getConversationMessages(conversationId: string, authUser: UserDocument) {
    const conversations = await ConversationService.findConversationWhereAuthUserBelongsTo(+conversationId, +authUser.id!);
    if (!conversations.length) throw new HttpError(404, "Conversation not found");
    return Message
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.writter", "writter")
      .leftJoinAndSelect("message.conversation", "conversation")
      .where("message.conversationId = :conversationId", { conversationId })
      .orderBy("message.created_at", "DESC")
      .getMany();
  },
  async findAndThrowError(query: FindOptionsWhere<Message>) {
    const doc = await Message.findOne({ where: query });
    if (!doc) throw new HttpError(404, "Message not found!");
    return doc;
  },
  async findOne(query: FindOptionsWhere<Message>) {
    const doc = await Message.findOne({ where: query });
    return doc;
  },
  async createMessage(body: CreateMessageBody) {
    const conversations = await ConversationService.findConversationWhereAuthUserBelongsTo(+body.conversationId, +body.writter?.id!);
    if (!conversations.length) throw new HttpError(404, "Conversation not found");
    const doc = Message.create({
      message: body.message,
      conversation: conversations[0],
      writter: body.writter
    });
    return doc.save();
  }
}