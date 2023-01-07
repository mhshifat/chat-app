import { FindOptionsWhere } from "typeorm";
import { Message } from "./entity"
import { MessageDocument, CreateMessageBody, UpdateMessageBody } from "./types";
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
    conversations[0].lastMessageSent = doc;
    const newDoc = await doc.save();
    await conversations[0].save();
    return newDoc;
  },
  async updateMessage(id: Message["id"], body: UpdateMessageBody, authUser: UserDocument) {
    const message = await Message
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.conversation", "conversation")
      .where("message.id = :id", { id })
      .andWhere("message.writter.id = :writterId", { writterId: authUser.id })
      .leftJoinAndSelect("message.writter", "writter")
      .getOne();
    if (!message) throw new HttpError(403, "Not authorized");
    message.message = body.message;
    const updatedMsg = await message.save();
    const conversations = await ConversationService.findConversationWhereAuthUserBelongsTo(+message.conversation.id, +authUser.id!);
    if (conversations?.[0]?.lastMessageSent?.id === updatedMsg.id) {
      conversations[0].lastMessageSent = message;
      await conversations[0].save();
    }
    return updatedMsg;
  },
  async deleteMessage(id: Message["id"], authUser: UserDocument) {
    const message = await Message
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.conversation", "conversation")
      .where("message.id = :id", { id })
      .andWhere("message.writter.id = :writterId", { writterId: authUser.id })
      .leftJoinAndSelect("message.writter", "writter")
      .getOne();
    if (!message) throw new HttpError(403, "Not authorized");
    const conversations = await ConversationService.findConversationWhereAuthUserBelongsTo(+message.conversation.id, +authUser.id!);
    if (conversations?.[0]?.lastMessageSent?.id === message.id) {
      const lastMessages = await Message
        .createQueryBuilder("message")
        .orderBy("created_at", "DESC")
        .limit(2)
        .getMany();
      conversations[0].lastMessageSent = lastMessages[1];
      await conversations[0].save();
    }
    await message.remove();
    return {...message, id: +id};
  },
}